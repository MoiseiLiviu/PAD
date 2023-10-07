import {Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {AuthModule} from "./auth/auth.module";
import {UserModule} from "./user/user.module";


import {UserEntity} from "./user/infrastructure/typeorm/entities/user.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {DB_DATABASE, DB_HOST, DB_LOGGING, DB_PASSWORD, DB_PORT, DB_SSL, DB_USERNAME} from "@pad_lab/common";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env"
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                    host: configService.get(DB_HOST),
                    port: configService.get<number>(DB_PORT),
                    username: configService.get(DB_USERNAME),
                    password: configService.get(DB_PASSWORD),
                    database: configService.get(DB_DATABASE),
                    entities: [UserEntity],
                    migrations: ['dist/migrations/*{.ts,.js}'],
                    migrationsRun: true,
                    synchronize: false,
                    logging: configService.get<boolean>(DB_LOGGING, false),
                    ssl: configService.get<boolean>(DB_SSL, false),
            })
        }),
        UserModule,
        AuthModule]
})
export class AppModule {
}
