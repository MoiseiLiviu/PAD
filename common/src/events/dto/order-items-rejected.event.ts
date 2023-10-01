import {FailedProductApprovalDto} from "./failed-product-approval.dto";

export class OrderItemsRejectedEvent {
    sagaId: string;
    orderId: number;
    failedProductApprovals: FailedProductApprovalDto[];

    constructor(orderId: number, failedProductApprovals: FailedProductApprovalDto[], sagaId: string) {
        this.orderId = orderId;
        this.sagaId = sagaId;
        this.failedProductApprovals = failedProductApprovals;
    }
}