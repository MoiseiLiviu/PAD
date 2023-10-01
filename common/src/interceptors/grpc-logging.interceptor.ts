import {CallHandler, ExecutionContext, Injectable, NestInterceptor, Inject} from '@nestjs/common';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {LoggerPort,LoggerAdapterToken} from '../logger/logger.port';

@Injectable()
export class GrpcLoggingInterceptor implements NestInterceptor {
    constructor(
        @Inject(LoggerAdapterToken)
        private readonly logger: LoggerPort) {
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const methodName = context.getHandler().name;
        const className = context.getClass().name;
        const args = context.getArgByIndex(1);

        this.logger.log(`Class: ${className}`, ` Method: ${methodName} Args: ${JSON.stringify(args)}`);

        const now = Date.now();
        return next
            .handle()
            .pipe(
                tap(() => this.logger.log(`Class ${className}`, `Finished execution of method: ${methodName} in ${Date.now() - now}ms`)),
            );
    }
}
