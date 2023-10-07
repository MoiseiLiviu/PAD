import { OrderCreatedEvent } from '@pad_lab/common';

export interface ApproveOrderItemsPort {
  execute(orderCreatedEvent: OrderCreatedEvent);
}
