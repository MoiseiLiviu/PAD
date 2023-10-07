import {Module} from '@nestjs/common';
import {ClientGrpc, ClientsModule, Transport} from '@nestjs/microservices';
import * as productProto from './adapters/product/proto/product.pb';
import * as orderProto from './adapters/order/proto/order.pb';

import {CartDataAccessModule} from './mongo/cart-data-access.module';
import {
    CHECK_PRODUCT_AVAILABILITY_ADAPTER_TOKEN,
    CircuitBreakerServiceToken,
    GET_PRODUCT_BY_ID_ADAPTER_TOKEN,
    INIT_ORDER_ADAPTER_TOKEN,
    ProductServiceToken,
} from '../tokens/cart-tokens';
import {CheckProductAvailabilityAdapter} from './adapters/product/check-product-availability.adapter';
import {GetProductByIdAdapter} from './adapters/product/get-product-by-id.adapter';
import {InitOrderAdapter} from './adapters/order/init-order-adapter.service';
import {CircuitBreakerService, LoggerModule} from '@nest-upskilling/common';
import {ConfigService} from '@nestjs/config';
import * as path from 'path';

@Module({
    imports: [
        LoggerModule,
        CartDataAccessModule,
        ClientsModule.registerAsync([
            {
                name: 'PRODUCT_PACKAGE',
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.GRPC,
                    options: {
                        url: configService.get<string>('PRODUCT_SERVICE_URL'),
                        package: productProto.protobufPackage,
                        protoPath: path.resolve(__dirname, '../../../protos/proto/product.proto'),
                    },
                }),
            },
            {
                name: 'ORDER_PACKAGE',
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.GRPC,
                    options: {
                        url: configService.get<string>('ORDER_SERVICE_URL'),
                        package: orderProto.protobufPackage,
                        protoPath: path.resolve(__dirname, '../../../protos/proto/order.proto'),
                    },
                }),
            },
        ]),
    ],
    providers: [
        {
            inject: ['PRODUCT_PACKAGE'],
            useFactory: (clientGrpc: ClientGrpc) =>
                clientGrpc.getService<productProto.ProductServiceClient>(
                    'ProductService',
                ),
            provide: ProductServiceToken,
        },
        {
            provide: CHECK_PRODUCT_AVAILABILITY_ADAPTER_TOKEN,
            useClass: CheckProductAvailabilityAdapter,
        },
        {
            provide: GET_PRODUCT_BY_ID_ADAPTER_TOKEN,
            useClass: GetProductByIdAdapter,
        },
        {
            provide: INIT_ORDER_ADAPTER_TOKEN,
            useClass: InitOrderAdapter,
        },
        {
            provide: CircuitBreakerServiceToken,
            useClass: CircuitBreakerService
        }
    ],
    exports: [
        CartDataAccessModule,
        ProductServiceToken,
        GET_PRODUCT_BY_ID_ADAPTER_TOKEN,
        CHECK_PRODUCT_AVAILABILITY_ADAPTER_TOKEN,
        INIT_ORDER_ADAPTER_TOKEN,
    ],
})
export class CartInfrastructureModule {
}
