import { OrderCreatedEvent } from '@pad_lab/common';

export interface PublishOrderCreatedEventPort {
  execute(orderCreatedEvent: OrderCreatedEvent): Promise<void>;
}
