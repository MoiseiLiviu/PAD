import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class GrpcRateLimiterInterceptor implements NestInterceptor {
    private static readonly LIMIT = 100;
    private static readonly ALERT_THRESHOLD = 60;
    private requestCount = 0;
    private lastRequestTimestamp = Date.now();

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const now = Date.now();
        if (now - this.lastRequestTimestamp > 1000) {
            this.requestCount = 0;
            this.lastRequestTimestamp = now;
        }

        this.requestCount++;

        if (this.requestCount > GrpcRateLimiterInterceptor.LIMIT) {
            return throwError(() => new Error('Rate limit exceeded'));
        }

        if (this.requestCount > GrpcRateLimiterInterceptor.ALERT_THRESHOLD) {
            this.sendAlert();
        }

        return next.handle().pipe(
            catchError(err => {
                throw err;
            }),
        );
    }

    sendAlert() {
        console.error('Request rate exceeds alert threshold');
    }
}
