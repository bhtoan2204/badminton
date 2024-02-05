import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthApiModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(8080),
      }),
      envFilePath: './apps/gateway/.env'
    }),
    AuthApiModule,
    PaymentModule
  ],
  controllers: [],
  providers: [],
})
export class GatewayModule { }
