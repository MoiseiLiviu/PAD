import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload, Transport } from '@nestjs/microservices';
import {
  LoggerAdapterToken,
  LoggerPort,
  OrderApprovedEvent,
} from '@nest-upskilling/common';
import { InitPaymentPort } from '../../application/ports/input/init-payment.port';
import { INIT_PAYMENT_USE_CASE } from '../../tokens/payment-tokens';

@Controller()
export class PaymentKafkaController {
  constructor(
    @Inject(LoggerAdapterToken)
    private readonly loggerPort: LoggerPort,
    @Inject(INIT_PAYMENT_USE_CASE)
    private readonly initPaymentPort: InitPaymentPort,
  ) {}

  @MessagePattern('order.approved', Transport.KAFKA)
  async initPayment(@Payload() orderApprovedEvent: OrderApprovedEvent) {
    this.loggerPort.log(
      'PaymentKafkaController',
      `Received order approved event: ${JSON.stringify(
        orderApprovedEvent,
      )}, initiating payment...`,
    );
    await this.initPaymentPort.execute(orderApprovedEvent);
  }
}
