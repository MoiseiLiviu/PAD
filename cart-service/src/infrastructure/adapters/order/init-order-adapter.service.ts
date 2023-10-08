import {InitOrderPort} from '../../../application/ports/output/init-order.port';
import {Inject, Injectable, OnModuleInit} from '@nestjs/common';
import {InitOrderResponse, OrderServiceClient} from './proto/order.pb';
import {ClientGrpc} from '@nestjs/microservices';
import {firstValueFrom} from 'rxjs';
import {CartRepositoryToken, CircuitBreakerServiceToken} from '../../../tokens/cart-tokens';
import {CartRepository} from '../../../domain/repositories/cart.repository';
import {LoggerAdapterToken, LoggerPort} from '@pad_lab/common';
import {CircuitBreakerService} from "../circuit-breaker.service";

@Injectable()
export class InitOrderAdapter implements InitOrderPort, OnModuleInit {
    private orderServiceClient: OrderServiceClient;

    constructor(
        @Inject(LoggerAdapterToken)
        private readonly loggerPort: LoggerPort,
        @Inject('ORDER_PACKAGE')
        private readonly clientGrpc: ClientGrpc,
        @Inject(CartRepositoryToken)
        private readonly cartRepository: CartRepository,
        @Inject(CircuitBreakerServiceToken)
        private readonly circuitBreaker: CircuitBreakerService
    ) {
    }

    onModuleInit(): any {
        this.orderServiceClient =
            this.clientGrpc.getService<OrderServiceClient>('OrderService');
    }

    async execute(userId: number) {
        const {items} = await this.cartRepository.getByUserId(userId);
        this.loggerPort.log(
            'InitOrderAdapter',
            `Initiating order for user with id: ${userId},
      items: ${items}`,
        );
        try {
            const response: InitOrderResponse = await firstValueFrom(
                this.orderServiceClient.initOrder({
                    userId,
                    items,
                }),
            );
            return response.orderId;
        } catch (e) {
            this.circuitBreaker.trackError('InitOrder')
        }
    }
}
