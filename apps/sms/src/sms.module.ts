import { Module } from '@nestjs/common';
import { TwilioModule } from 'nestjs-twilio';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RmqModule } from '@app/common';
import { SmsController } from './sms.controller';
import { SmsService } from './sms.service';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_SMS_QUEUE: Joi.string().required(),
        TWILIO_ACCOUNT_SID: Joi.string().required(),
        TWILIO_AUTH_TOKEN: Joi.string().required(),
        TWILIO_PHONE_NUMBER: Joi.string().required(),
      }),
      envFilePath: './apps/sms/.env'
    }),
    TwilioModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
          accountSid: config.get('TWILIO_ACCOUNT_SID'),
          authToken: config.get('TWILIO_AUTH_TOKEN'),
      }),
      inject: [ConfigService],
    }),
    RmqModule,
  ],
  controllers: [SmsController],
  providers: [SmsService],
})
export class SmsModule { }