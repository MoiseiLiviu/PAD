import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { PaymentRepoImpl } from './repository/payment-repo-impl';
import {
  OutboxRepositoryToken,
  PaymentRepositoryToken,
} from '../../tokens/payment-tokens';
import { ConfigService } from '@nestjs/config';
import { getTypeOrmConfig } from './config/typeorm.config';
import { OutboxEntity } from './entities/outbox.entity';
import { OutboxRepoImpl } from './repository/outbox-repo.impl';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getTypeOrmConfig(configService, [PaymentEntity, OutboxEntity]),
    }),
    TypeOrmModule.forFeature([PaymentEntity, OutboxEntity]),
  ],
  providers: [
    {
      provide: OutboxRepositoryToken,
      useClass: OutboxRepoImpl,
    },
    {
      provide: PaymentRepositoryToken,
      useClass: PaymentRepoImpl,
    },
  ],
  exports: [PaymentRepositoryToken, OutboxRepositoryToken],
})
export class PaymentTypeormModule {}
