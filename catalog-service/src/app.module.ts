import { Module } from "@nestjs/common";
import { CategoryModule } from "./category/category.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ProductModule } from "./product/product.module";
import { DB_DATABASE, DB_HOST, DB_LOGGING, DB_PASSWORD, DB_PORT, DB_SSL, DB_USERNAME } from "@pad_lab/common";
import { ProductEntity } from "./product/infrastructure/typeorm/entities/product.entity";
import { CategoryEntity } from "./category/infrastructure/typeorm/entities/CategoryEntity";
import { OutboxEntity } from "./product/infrastructure/typeorm/entities/outbox.entity";

@Module({
  imports: [
    CategoryModule,
    ProductModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env"
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get(DB_HOST),
        port: configService.get<number>(DB_PORT),
        username: configService.get(DB_USERNAME),
        password: configService.get(DB_PASSWORD),
        database: configService.get(DB_DATABASE),
        entities: [ProductEntity, CategoryEntity, OutboxEntity],
        migrations: ["dist/migrations/*{.ts,.js}"],
        migrationsRun: true,
        synchronize: false,
        logging: configService.get<boolean>(DB_LOGGING, false),
        ssl: configService.get<boolean>(DB_SSL, false)
      })
    })
  ]
})
export class AppModule {
}
