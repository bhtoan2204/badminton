import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { RmqModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_PAYMENT_QUEUE: Joi.string().required(),
      }),
      envFilePath: process.env.NODE_ENV === 'production' ? './apps/payment/.env.production' : './apps/payment/.env',
    }),
    RmqModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule { }
