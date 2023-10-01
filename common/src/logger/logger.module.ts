import {Module} from '@nestjs/common';
import { GrpcLoggingInterceptor } from '../interceptors';
import {LoggerAdapter} from "./logger-adapter";
import {LoggerAdapterToken} from './logger.port';
import {WinstonLoggerAdapter} from './winston-logger.adapter';

@Module({
    providers: [
        {
            provide: LoggerAdapterToken,
            useClass: WinstonLoggerAdapter,
        },
        GrpcLoggingInterceptor
    ],
    exports: [LoggerAdapterToken],
})
export class LoggerModule {
}
