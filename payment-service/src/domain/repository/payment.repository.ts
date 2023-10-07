import { Payment } from '../models/payment.model';

export interface PaymentRepository {
  save(payment: Payment): Promise<Payment>;

  update(payment: Payment): Promise<void>;

  getById(paymentId: number): Promise<Payment>;

  transaction<R>(callback: () => Promise<R>): Promise<R>;
}
