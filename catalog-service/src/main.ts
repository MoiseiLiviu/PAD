import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { GrpcRateLimiterInterceptor } from '../../common/src/interceptors/rate-limiter.interceptor';
import { TimeoutInterceptor } from '../../common/src/interceptors/timeout.interceptor';

require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: ['category', 'product'],
      protoPath: [
        'node_modules/protos/proto/category.proto',
        'node_modules/protos/proto/product.proto',
      ],
      url: '0.0.0.0:5002',
    },
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      consumer: {
        groupId: 'catalog-service-group',
      },
      client: {
        brokers: [process.env.KAFKA_BROKER_URL || 'localhost:9092'],
      },
    },
  });
  app.useGlobalInterceptors(new GrpcRateLimiterInterceptor());
  app.useGlobalInterceptors(new TimeoutInterceptor());

  await app.startAllMicroservices();
}

bootstrap();
