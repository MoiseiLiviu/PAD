import {
  PaymentProcessedSuccessfullyEvent,
  PaymentProcessingFailedEvent,
} from '@nest-upskilling/common';

export interface PublishPaymentProcessedEventPort {
  successful(
    paymentProcessedSuccessfullyEvent: PaymentProcessedSuccessfullyEvent,
  ): Promise<void>;

  failed(
    paymentProcessingFailedEvent: PaymentProcessingFailedEvent,
  ): Promise<void>;
}
