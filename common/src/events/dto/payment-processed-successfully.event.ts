export class PaymentProcessedSuccessfullyEvent {
    orderId: number;
    sagaId: string;

    constructor(orderId: number, sagaId: string) {
        this.orderId = orderId;
        this.sagaId = sagaId;
    }
}