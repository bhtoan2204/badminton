import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { TwilioService } from 'nestjs-twilio';
import { Otp } from '../models/otp.model';

@Injectable()
export class OTPService {
  constructor(
    private readonly twilioService: TwilioService,
    private readonly configService: ConfigService,
    @InjectRepository(Otp) private otpRepository: Otp
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
      return new UnauthorizedException(error.message);
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
      return new UnauthorizedException(error.message);
    }
  }
}