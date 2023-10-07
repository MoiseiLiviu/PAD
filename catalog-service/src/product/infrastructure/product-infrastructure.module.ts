import { Module } from '@nestjs/common';
import { ProductTypeormModule } from './typeorm/product-typeorm.module';
import { LoggerModule } from '@pad_lab/common';

@Module({
  imports: [LoggerModule, ProductTypeormModule],
  exports: [ProductTypeormModule],
})
export class ProductInfrastructureModule {}
