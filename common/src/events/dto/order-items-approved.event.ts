import {CartItemDto} from '../../dto/cart-item.dto';

export class OrderItemsApprovedEvent {
    orderId: number;
    sagaId: string;
    items: CartItemDto[];

    constructor(orderId: number, sagaId: string,     items: CartItemDto[]) {
        this.orderId = orderId;
        this.sagaId = sagaId;
        this.items = items;
    }
}