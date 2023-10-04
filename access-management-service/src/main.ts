import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {MicroserviceOptions, Transport} from '@nestjs/microservices';
import {protobufPackage} from './auth/interface/grpc/proto/auth.pb';
import {HttpExceptionFilter} from "./auth/infrastructure/filter/all-exceptions.filter";
import * as path from 'path';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.GRPC,
            options: {
                url: '0.0.0.0:5001',
                package: [protobufPackage, 'grpc.health.v1'],
                protoPath: [path.resolve(__dirname, '../../protos/proto/auth.proto'), path.resolve(__dirname, '../../protos/proto/health.proto')]
            }
        },
    );

    app.useGlobalFilters(new HttpExceptionFilter());

    await app.listen();
}

bootstrap();
