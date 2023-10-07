import { OrderApprovedEvent } from '@nest-upskilling/common';

export interface InitPaymentPort {
  execute(oderApprovedEvent: OrderApprovedEvent);
}
