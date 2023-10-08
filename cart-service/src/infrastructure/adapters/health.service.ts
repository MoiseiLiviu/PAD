import {ServingStatus} from "../../interface/health.controller";
import {Injectable} from "@nestjs/common";

@Injectable()
export class HealthService {
    status: ServingStatus = ServingStatus.SERVING;
}