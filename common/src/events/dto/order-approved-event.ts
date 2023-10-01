import {CartItemDto} from '../../dto/cart-item.dto';

export class OrderApprovedEvent {
    sagaId: string;
    orderId: number;
    userId: number;
    price: number;
    items: CartItemDto[];

    constructor(sagaId: string, orderId: number, userId: number, price: number, items: CartItemDto[]) {
        this.sagaId = sagaId;
        this.orderId = orderId;
        this.userId = userId;
        this.price = price;
        this.items = items;
    }
}