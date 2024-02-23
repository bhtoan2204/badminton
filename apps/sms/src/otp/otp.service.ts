import { OTP } from '@app/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { TwilioService } from 'nestjs-twilio';

@Injectable()
export class OTPService {
  constructor(
    private readonly twilioService: TwilioService,
    private readonly configService: ConfigService,
    @InjectRepository(OTP) private otpRepository: OTP
  ) { }

  async sendRegisterOTP() {
    try {
      const message = await this.twilioService.client.messages.create({
        body: 'OTP Body, sent to the phone! for register',
        from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
        to: '+84971308623',
      });
      return message;
    }
    catch (error) {
      throw error;
    }
  }

  async sendForgotOTP() {
    try {
      const message = await this.twilioService.client.messages.create({
        body: 'OTP Body, sent to the phone! for forgot password',
        from: this.configService.get<string>('TWILIO_PHONE_NUMBER'),
        to: '+84971308623',
      });
      return message;
    }
    catch (error) {
      throw error;
    }
  }
}