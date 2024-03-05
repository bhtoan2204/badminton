import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthApiModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { SmsModule } from './sms/sms.module';
import * as Joi from 'joi';
import { FamilyModule } from './family/family.module';
import { AdminModule } from './admin/admin.module';
import { MailModule } from './mailer/mailer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(8080),
        SESSION_SECRET: Joi.string().required(),

        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
        RABBIT_MQ_PAYMENT_QUEUE: Joi.string().required(),
        RABBIT_MQ_SMS_QUEUE: Joi.string().required(),

        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_REDIRECT_URI: Joi.string().required(),

        JWT_SECRET: Joi.string().required(),
        JWT_SECRET_REFRESH: Joi.string().required(),
      }),
      envFilePath: './apps/gateway/.env'
    }),
    AuthApiModule,
    PaymentModule,
    MailModule,
    SmsModule,
    FamilyModule,
    AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class GatewayModule { }
