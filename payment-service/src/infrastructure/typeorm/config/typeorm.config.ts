import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  DB_DATABASE,
  DB_HOST,
  DB_LOGGING,
  DB_PASSWORD,
  DB_PORT,
  DB_SSL,
  DB_USERNAME,
} from '@pad_lab/common';

export const getTypeOrmConfig = (
  configService: ConfigService,
  entities: any[],
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get(DB_HOST),
  port: configService.get<number>(DB_PORT),
  username: configService.get(DB_USERNAME),
  password: configService.get(DB_PASSWORD),
  database: configService.get(DB_DATABASE),
  entities,
  migrations: ['dist/migrations/*{.ts,.js}'],
  migrationsRun: true,
  synchronize: false,
  logging: configService.get<boolean>(DB_LOGGING, false),
  ssl: configService.get<boolean>(DB_SSL, false),
});
