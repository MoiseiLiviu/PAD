import { ProcessPaymentPort } from '../../application/ports/output/process-payment.port';
import { Injectable } from '@nestjs/common';
import { Payment } from '../../domain/models/payment.model';

const { v4: uuidv4 } = require('uuid');

@Injectable()
export class ProcessPaymentAdapter implements ProcessPaymentPort {
  execute(payment: Payment): Promise<string> {
    if (Math.random() > 0.2) {
      return uuidv4();
    } else {
      throw new Error('Payment failed');
    }
  }
}
