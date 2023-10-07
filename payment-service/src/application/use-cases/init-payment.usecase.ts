import { Payment } from '../../domain/models/payment.model';
import { PaymentRepository } from '../../domain/repository/payment.repository';
import {
  CartItemDto,
  LoggerPort,
  OrderApprovedEvent,
  OutboxStatus,
  PaymentProcessedSuccessfullyEvent,
  PaymentProcessingFailedEvent,
  PaymentProcessingFailure,
  PaymentProcessingFailureReason,
  SagaStatus,
} from '@nest-upskilling/common';
import { InitPaymentPort } from '../ports/input/init-payment.port';
import { PaymentStatus } from '../../domain/models/payment-status.enum';
import { ProcessPaymentPort } from '../ports/output/process-payment.port';
import { OutboxRepository } from '../../domain/repository/outbox.repository';
import { Outbox } from '../../domain/models/outbox';

import {
  PaymentProcessedSuccessfullyEventTopic,
  PaymentProcessingFailedTopic,
} from '../../tokens/payment-tokens';

export class InitPaymentUseCase implements InitPaymentPort {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly loggerPort: LoggerPort,
    private readonly processPaymentPort: ProcessPaymentPort,
    private readonly outboxRepository: OutboxRepository,
  ) {}

  async execute(orderApprovedEvent: OrderApprovedEvent): Promise<any> {
    const payment = new Payment(
      orderApprovedEvent.userId,
      orderApprovedEvent.orderId,
      orderApprovedEvent.price,
    );
    this.loggerPort.log(
      'InitPaymentCommandHandler',
      `payment initiated by user with id ${orderApprovedEvent.userId}`,
    );
    const savedPayment = await this.paymentRepository.save(payment);
    this.loggerPort.log(
      'InitPaymentUseCase execute',
      `Payment: ${JSON.stringify(savedPayment)} initiated successfully.`,
    );
    await this.processPayment(
      savedPayment,
      orderApprovedEvent.sagaId,
      orderApprovedEvent.items,
    );
  }

  async processPayment(payment: Payment, sagaId: string, items: CartItemDto[]) {
    try {
      const transactionId = await this.processPaymentPort.execute(payment);
      payment.status = PaymentStatus.SUCCESSFUL;
      payment.transactionId = transactionId;
      const event = new PaymentProcessedSuccessfullyEvent(
        payment.orderId,
        sagaId,
      );
      await this.updatePaymentState(
        payment,
        event,
        PaymentProcessedSuccessfullyEventTopic,
        sagaId,
      );
    } catch (ex) {
      payment.status = PaymentStatus.FAILED;
      const event = new PaymentProcessingFailedEvent(
        payment.orderId,
        new PaymentProcessingFailure(
          PaymentProcessingFailureReason.EXTERNAL_PROVIDER_FAILURE,
          `Payment processing failed for payment with id: ${payment.id}, saga id: ${sagaId}, order id: ${payment.orderId}`,
        ),
        sagaId,
        items,
      );
      await this.updatePaymentState(
        payment,
        event,
        PaymentProcessingFailedTopic,
        sagaId,
      );
      this.loggerPort.log(
        'InitPaymentUseCase execute',
        `payment processing for payment with id ${payment.id} failed.`,
      );
    }
  }

  async updatePaymentState(
    payment: Payment,
    event: PaymentProcessedSuccessfullyEvent | PaymentProcessingFailedEvent,
    eventTopic: string,
    sagaId: string,
  ) {
    this.loggerPort.log('InitPaymentUseCase', 'Saving outbox event.');
    await this.paymentRepository.transaction(async () => {
      await this.paymentRepository.update(payment);
      await this.outboxRepository.save(
        new Outbox(
          null,
          OutboxStatus.STARTED,
          SagaStatus.PROCESSING,
          JSON.stringify(event),
          eventTopic,
          sagaId,
        ),
      );
    });
  }
}
