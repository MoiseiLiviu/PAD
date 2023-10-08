import {CheckProductAvailabilityPort} from '../../../application/ports/output/check-product-availability.port';
import {Inject, Injectable} from '@nestjs/common';
import {CircuitBreakerServiceToken, ProductServiceToken} from '../../../tokens/cart-tokens';

import {CheckProductAvailabilityResponse, ProductServiceClient,} from './proto/product.pb';
import {firstValueFrom} from 'rxjs';
import {CircuitBreakerService} from "../circuit-breaker.service";

@Injectable()
export class CheckProductAvailabilityAdapter
    implements CheckProductAvailabilityPort {
    constructor(
        @Inject(ProductServiceToken)
        private readonly productServiceClient: ProductServiceClient,
        @Inject(CircuitBreakerServiceToken)
        private readonly circuitBreaker: CircuitBreakerService
    ) {
    }

    async execute(productId: number, quantity: number): Promise<boolean> {
        try {
            const response: CheckProductAvailabilityResponse = await firstValueFrom(
                this.productServiceClient.checkProductAvailability({
                    productId,
                    quantity,
                }),
            );

            return response.isAvailable;
        } catch (e) {
            this.circuitBreaker.trackError('ProductAvailability')
        }
    }
}
