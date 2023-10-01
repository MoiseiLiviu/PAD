import {CartItemDto} from '../../dto/cart-item.dto';

export class PaymentProcessingFailedEvent {
    sagaId: string;
    orderId: number;
    failure: PaymentProcessingFailure;
    items: CartItemDto[];

    constructor(orderId: number, failure: PaymentProcessingFailure, sagaId: string, items: CartItemDto[]) {
        this.orderId = orderId;
        this.failure = failure;
        this.sagaId = sagaId;
        this.items = items;
    }
}

export class PaymentProcessingFailure {
    reason: PaymentProcessingFailureReason;
    message: string;

    constructor(reason: PaymentProcessingFailureReason, message: string) {
        this.reason = reason;
        this.message = message;
    }
}

export enum PaymentProcessingFailureReason {
    EXTERNAL_PROVIDER_FAILURE,
    DATA_ACCESS_FAILURE
}
