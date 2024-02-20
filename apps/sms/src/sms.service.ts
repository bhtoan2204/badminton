import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwilioClient, TwilioService } from 'nestjs-twilio';
import { Twilio } from 'twilio';

@Injectable()
export class SmsService {
  constructor(
    private readonly twilioService: TwilioService,
    private readonly configService: ConfigService,
  ) { }

  async sendRegisterSMS() {
    console.log(this.configService.get<string>('TWILIO_PHONE_NUMBER'))
    try {
      return this.twilioService.client.messages.create({
        body: 'SMS Body, sent to the phone! for register',
        from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
        to: '+84971308623',
      });
    }
    catch (error) {
      Logger.error(error);
      return error;
    }
  }

  async sendForgotSMS() {
    console.log(this.configService.get<string>('TWILIO_PHONE_NUMBER'));
    try {
      return this.twilioService.client.messages.create({
        body: 'SMS Body, sent to the phone! for register',
        from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
        to: '+84971308623',
      });
    }
    catch (error) {
      Logger.error(error);
      return error;
    }
  }
}