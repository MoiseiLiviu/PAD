import { Injectable } from '@nestjs/common';
import { Subject, timer } from 'rxjs';
import { catchError, retryWhen, tap, mergeMap } from 'rxjs/operators';

@Injectable()
export class CircuitBreakerService {
    private errorCount = 0;
    private readonly threshold = 3;
    private readonly resetTime = 5000 * 3.5;
    private circuitOpened = new Subject<void>();

    handleRequest$(requestObservable) {
        return requestObservable.pipe(
            retryWhen(errors =>
                errors.pipe(
                    tap(() => {
                        this.errorCount += 1;
                        if (this.errorCount >= this.threshold) {
                            this.circuitOpened.next();
                        }
                    }),
                    mergeMap(() => {
                        if (this.errorCount >= this.threshold) {
                            return timer(this.resetTime);
                        }
                        return timer(0);
                    }),
                    catchError(() => {
                        return [];
                    })
                )
            )
        );
    }
}
