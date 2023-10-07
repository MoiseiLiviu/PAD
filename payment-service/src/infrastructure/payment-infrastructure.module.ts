import { Module } from '@nestjs/common';
import { ProcessPaymentAdapter } from './adapters/process-payment.adapter';
import { PaymentTypeormModule } from './typeorm/payment-typeorm.module';
import { PROCESS_PAYMENT_ADAPTER } from '../tokens/payment-tokens';
import { LoggerModule } from '@pad_lab/common';

@Module({
  imports: [PaymentTypeormModule, LoggerModule],
  providers: [
    {
      provide: PROCESS_PAYMENT_ADAPTER,
      useClass: ProcessPaymentAdapter,
    },
  ],
  exports: [PROCESS_PAYMENT_ADAPTER, PaymentTypeormModule],
})
export class PaymentInfrastructureModule {}
