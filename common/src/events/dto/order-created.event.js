"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderCreatedEvent = void 0;
class OrderCreatedEvent {
    constructor(orderId, paymentId) {
        this.orderId = orderId;
        this.paymentId = paymentId;
    }
}
exports.OrderCreatedEvent = OrderCreatedEvent;
