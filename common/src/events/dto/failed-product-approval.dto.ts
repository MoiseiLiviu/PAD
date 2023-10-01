export class FailedProductApprovalDto {
    productId: number;
    failedChecks: FailedCheckDto[];

    constructor(productId: number, failedChecks: FailedCheckDto[]) {
        this.productId = productId;
        this.failedChecks = failedChecks;
    }
}

export class FailedCheckDto {
    reason: ProductApprovalFailReason;
    message: string;
    
    constructor(reason: ProductApprovalFailReason, message: string) {
        this.reason = reason;
        this.message = message;
    }
}

export enum ProductApprovalFailReason {
    NOT_FOUND,
    DIFFERENT_PRICE,
    NOT_ENOUGH_UNITS
}