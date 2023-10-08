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
        package: [protobufPackage,'grpc.health.v1'],
        protoPath: ['node_modules/@pad_lab/common/protos/proto/cart.proto','node_modules/@pad_lab/common/protos/proto/health.proto'],
        url: '0.0.0.0:5004',
      },
    },
  );

  await app.listen();
}

bootstrap();
