import { Payment } from '../../../domain/models/payment.model';

export interface ProcessPaymentPort {
  execute(payment: Payment): Promise<string>;
}
