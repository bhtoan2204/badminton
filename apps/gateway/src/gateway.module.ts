import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AUTH_SERVICE } from '../constant/services.constant';
import { AuthModule, RmqModule } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(8080),
      }),
      envFilePath: './apps/gateway/.env'
    }),
    RmqModule.register({ name: AUTH_SERVICE }),
    AuthModule
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule { }
