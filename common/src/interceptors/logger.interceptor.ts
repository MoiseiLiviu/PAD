import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LoggerPort, LoggerAdapterToken } from '../logger/logger.port';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(LoggerAdapterToken)
    private readonly logger: LoggerPort,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const gqlCtx = GqlExecutionContext.create(context);
    const now = Date.now();
    const info = gqlCtx.getInfo();

    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(
            'Logging Interceptor',
            `GraphQL operation: ${info.operation.operation} ${
              info.fieldName
            } took ${Date.now() - now}ms`,
          ),
        ),
      );
  }
}
