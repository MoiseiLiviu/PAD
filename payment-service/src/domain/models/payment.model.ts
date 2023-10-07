import { PaymentStatus } from './payment-status.enum';

export class Payment {
  id: number;
  orderId: number;
  userId: number;
  subtotal: number;
  transactionId: string;
  status: PaymentStatus;

  constructor(
    userId: number,
    orderId: number,
    subtotal: number,
    status: PaymentStatus = PaymentStatus.PENDING,
    id?: number,
  ) {
    this.id = id;
    this.userId = userId;
    this.subtotal = subtotal;
    this.status = status;
    this.orderId = orderId;
  }
}
