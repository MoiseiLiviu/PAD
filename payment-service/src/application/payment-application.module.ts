import { Module } from '@nestjs/common';
import { PaymentInfrastructureModule } from '../infrastructure/payment-infrastructure.module';
import {
  INIT_PAYMENT_USE_CASE,
  OutboxRepositoryToken,
  PaymentRepositoryToken,
  PROCESS_PAYMENT_ADAPTER,
} from '../tokens/payment-tokens';
import { InitPaymentUseCase } from './use-cases/init-payment.usecase';
import {
  LoggerAdapterToken,
  LoggerModule,
  LoggerPort,
} from '@nest-upskilling/common';
import { PaymentRepository } from '../domain/repository/payment.repository';
import { ProcessPaymentPort } from './ports/output/process-payment.port';
import { OutboxRepository } from '../domain/repository/outbox.repository';
import { OutboxEventsScheduler } from './outbox/outbox-events.scheduler';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';

require('dotenv').config();

@Module({
  imports: [
    PaymentInfrastructureModule,
    ScheduleModule.forRoot(),
    LoggerModule,
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_BROKER_URL || 'localhost:9092'],
            retry: {
              retries: 5,
            },
          },
          consumer: {
            groupId: 'payment-service-group',
          },
        },
      },
    ]),
  ],
  providers: [
    OutboxEventsScheduler,
    {
      provide: INIT_PAYMENT_USE_CASE,
      inject: [
        PaymentRepositoryToken,
        LoggerAdapterToken,
        PROCESS_PAYMENT_ADAPTER,
        OutboxRepositoryToken,
      ],
      useFactory: (
        paymentRepository: PaymentRepository,
        loggerPort: LoggerPort,
        processPaymentPort: ProcessPaymentPort,
        outboxRepository: OutboxRepository,
      ) =>
        new InitPaymentUseCase(
          paymentRepository,
          loggerPort,
          processPaymentPort,
          outboxRepository,
        ),
    },
  ],
  exports: [INIT_PAYMENT_USE_CASE],
})
export class PaymentApplicationModule {}
