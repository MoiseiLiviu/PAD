import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {MicroserviceOptions, Transport} from '@nestjs/microservices';
import {protobufPackage} from './auth/interface/grpc/proto/auth.pb';
import {HttpExceptionFilter} from "./auth/infrastructure/filter/all-exceptions.filter";
import {GrpcRateLimiterInterceptor, TimeoutInterceptor} from "@pad_lab/common";

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
        AppModule,
        {
            transport: Transport.GRPC,
            options: {
                url: '0.0.0.0:5001',
                package: [protobufPackage, 'grpc.health.v1'],
                protoPath: ['node_modules/@pad_lab/common/protos/proto/auth.proto', 'node_modules/@pad_lab/common/protos/proto/health.proto']
            }
        },
    );

    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new GrpcRateLimiterInterceptor());
    app.useGlobalInterceptors(new TimeoutInterceptor());

    await app.listen();
}

bootstrap();
