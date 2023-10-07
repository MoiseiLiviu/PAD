import { Module } from '@nestjs/common';
import { PaymentApplicationModule } from './application/payment-application.module';
import { LoggerModule } from '@pad_lab/common';
import { PaymentKafkaController } from './interface/messaging/payment-kafka.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PaymentApplicationModule,
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [PaymentKafkaController],
})
export class PaymentModule {}
