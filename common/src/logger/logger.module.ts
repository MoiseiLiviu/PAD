import {Module} from '@nestjs/common';
import {GrpcLoggingInterceptor} from '../interceptors';
import {LoggerAdapterToken} from './logger.port';
import {LoggerAdapter} from "./logger-adapter";

@Module({
    providers: [
        {
            provide: LoggerAdapterToken,
            useClass: LoggerAdapter,
        },
        GrpcLoggingInterceptor
    ],
    exports: [LoggerAdapterToken],
})
export class LoggerModule {
}
