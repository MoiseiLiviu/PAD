import {
  PaymentProcessedSuccessfullyEvent,
  PaymentProcessingFailedEvent,
} from '@pad_lab/common';

export interface PublishPaymentProcessedEventPort {
  successful(
    paymentProcessedSuccessfullyEvent: PaymentProcessedSuccessfullyEvent,
  ): Promise<void>;

  failed(
    paymentProcessingFailedEvent: PaymentProcessingFailedEvent,
  ): Promise<void>;
}
