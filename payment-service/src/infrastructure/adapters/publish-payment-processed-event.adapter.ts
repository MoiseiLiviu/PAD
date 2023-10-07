import { PublishPaymentProcessedEventPort } from '../../application/ports/output/publish-payment-processed-event.port';
import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  LoggerAdapterToken,
  LoggerPort,
  PaymentProcessedSuccessfullyEvent,
  PaymentProcessingFailedEvent,
} from '@nest-upskilling/common';

@Injectable()
export class PublishPaymentProcessedEventAdapter
  implements PublishPaymentProcessedEventPort
{
  constructor(
    @Inject(LoggerAdapterToken)
    private readonly loggerPort: LoggerPort,
    @Inject('KAFKA_SERVICE')
    private readonly clientKafka: ClientKafka,
  ) {}

  async failed(
    paymentProcessingFailedEvent: PaymentProcessingFailedEvent,
  ): Promise<void> {
    const stringEvent = JSON.stringify(paymentProcessingFailedEvent);
    this.loggerPort.log(
      'PublishPaymentProcessedEventAdapter',
      `Sending payment processing failed event: ${stringEvent}`,
    );
    await this.clientKafka.emit('order.payment.failed', stringEvent);
  }

  async successful(
    paymentProcessedSuccessfullyEvent: PaymentProcessedSuccessfullyEvent,
  ): Promise<void> {
    const stringEvent = JSON.stringify(paymentProcessedSuccessfullyEvent);
    this.loggerPort.log(
      'PublishPaymentProcessedEventAdapter',
      `Sending payment processed successfully event: ${stringEvent}`,
    );
    await this.clientKafka.emit(
      'order.paid.successfully',
      JSON.stringify(paymentProcessedSuccessfullyEvent),
    );
  }
}
