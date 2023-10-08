import {bufferTime, filter, groupBy, mergeMap, Observable, Subject} from "rxjs";
import {Inject, Injectable} from "@nestjs/common";
import {HealthService} from "./health.service";
import {ServingStatus} from "../../interface/health.controller";

@Injectable()
export class CircuitBreakerService {
    private errorSubject: Subject<string>;
    private errorObservable: Observable<string[]>;

    constructor(private taskTimeoutLimit: number,
                @Inject() private healthSvc: HealthService){
        this.errorSubject = new Subject<string>();

        const bufferDuration = this.taskTimeoutLimit * 3.5;

        this.errorObservable = this.errorSubject.pipe(
            groupBy(error => error),
            mergeMap(group => group.pipe(
                bufferTime(bufferDuration),
                filter(errors => errors.length >= 3)
            ))
        );

        this.errorObservable.subscribe(errors => {
            if (errors.length > 0) {
                this.healthSvc.status = ServingStatus.NOT_SERVING;
            }
        });
    }

    trackError(endpoint: string) {
        this.errorSubject.next(endpoint);
    }
}
