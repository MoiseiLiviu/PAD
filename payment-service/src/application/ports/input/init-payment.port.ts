import { OrderApprovedEvent } from '@pad_lab/common';

export interface InitPaymentPort {
  execute(oderApprovedEvent: OrderApprovedEvent);
}
