import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthApiModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(8080),
      }),
      envFilePath: './apps/gateway/.env'
    }),
    AuthApiModule
  ],
  controllers: [],
  providers: [],
})
export class GatewayModule { }
