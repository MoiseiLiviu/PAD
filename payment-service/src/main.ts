import { NestFactory } from '@nestjs/core';
import { PaymentModule } from './payment.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PaymentModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_BROKER_URL || 'localhost:9092'],
          retry: {
            retries: 3,
          },
        },
        consumer: {
          groupId: 'payment-service-group',
        },
      },
    },
  );

  await app.listen();
}

bootstrap();
