import { AbstractEntity } from '@nest-upskilling/common';
import { Column, Entity } from 'typeorm';
import { PaymentStatus } from '../../../domain/models/payment-status.enum';

@Entity('payment')
export class PaymentEntity extends AbstractEntity {
  @Column()
  subtotal: number;

  @Column({ name: 'transaction_id' })
  transactionId: string;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'order_id' })
  orderId: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
  })
  status: PaymentStatus;

  constructor(
    id: number,
    subtotal: number,
    transactionId: string,
    userId: number,
    orderId: number,
    status: PaymentStatus,
  ) {
    super();
    this.id = id;
    this.subtotal = subtotal;
    this.transactionId = transactionId;
    this.userId = userId;
    this.status = status;
    this.orderId = orderId;
  }
}
