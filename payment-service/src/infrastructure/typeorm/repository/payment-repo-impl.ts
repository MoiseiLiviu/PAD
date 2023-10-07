import { PaymentRepository } from '../../../domain/repository/payment.repository';
import { Injectable } from '@nestjs/common';
import { Payment } from '../../../domain/models/payment.model';
import { Repository } from 'typeorm';
import { PaymentEntity } from '../entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMapper } from '../mapper/payment.mapper';

@Injectable()
export class PaymentRepoImpl implements PaymentRepository {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepo: Repository<PaymentEntity>,
  ) {}

  async getById(paymentId: number): Promise<Payment> {
    const paymentEntity = await this.paymentRepo.findOneBy({ id: paymentId });
    return PaymentMapper.toModel(paymentEntity);
  }

  async save(payment: Payment): Promise<Payment> {
    const entity = await this.paymentRepo.save(PaymentMapper.toEntity(payment));
    return PaymentMapper.toModel(entity);
  }

  async update(payment: Payment): Promise<void> {
    const entity = PaymentMapper.toEntity(payment);
    entity.orderId = payment.orderId;
    await this.paymentRepo.update({ id: payment.id }, entity);
  }

  transaction<R>(callback: () => Promise<R>): Promise<R> {
    return this.paymentRepo.manager.transaction(callback);
  }
}
