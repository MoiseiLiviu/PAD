import { NestFactory } from '@nestjs/core';
import { CartModule } from './cart.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { protobufPackage } from './proto/cart.pb';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CartModule,
    {
      transport: Transport.GRPC,
      options: {
        package: protobufPackage,
        protoPath: path.resolve(__dirname, '../../protos/proto/cart.proto'),
        url: '0.0.0.0:5004',
      },
    },
  );

  await app.listen();
}

bootstrap();
