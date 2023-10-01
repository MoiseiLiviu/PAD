import {CartItem} from "./cart-item";

export class OrderCreatedEvent {
    constructor(orderId: number, items: CartItem[], price: number, sagaId: string) {
        this.orderId = orderId;
        this.items = items;
        this.price = price;
        this.sagaId = sagaId;
    }

    sagaId: string;
    orderId: number;
    items: CartItem[];
    price: number;
}



