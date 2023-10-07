import { Payment } from '../../../domain/models/payment.model';
import { PaymentEntity } from '../entities/payment.entity';

export class PaymentMapper {
  static toEntity(payment: Payment) {
    return new PaymentEntity(
      payment.id,
      payment.subtotal,
      payment.transactionId,
      payment.userId,
      payment.orderId,
      payment.status,
    );
  }

  static toModel(entity: PaymentEntity) {
    return new Payment(
      entity.userId,
      entity.orderId,
      entity.subtotal,
      entity.status,
      entity.id,
    );
  }
}
