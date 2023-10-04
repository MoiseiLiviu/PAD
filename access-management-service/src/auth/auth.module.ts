import { Module } from '@nestjs/common';
import { AuthApplicationModule } from './application/auth-application.module';
import { AuthController } from "./interface/grpc/auth.controller";
import {HealthController} from "./interface/grpc/health.controller";

@Module({
  controllers: [AuthController, HealthController],
  imports: [AuthApplicationModule],
})
export class AuthModule {}
