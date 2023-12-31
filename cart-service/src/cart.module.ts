import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartController } from './interface/cart.controller';
import { CartApplicationModule } from './application/cart-application.module';
import { CartInfrastructureModule } from './infrastructure/cart-infrastructure.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from "@pad_lab/common/dist";
import {HealthController} from "./interface/health.controller";

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),
    CartApplicationModule,
    CartInfrastructureModule,
  ],
  controllers: [CartController, HealthController],
})
export class CartModule {
  constructor(private readonly configService: ConfigService) {
    console.log(`MONGO URL VALUE: ${configService.get<string>('MONGO_URL')}`);
  }
}
