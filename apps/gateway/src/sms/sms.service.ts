import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { SMS_SERVICE } from "apps/gateway/constant/services.constant";
import { catchError, lastValueFrom, timeout } from "rxjs";

@Injectable()
export class SmsService {
  constructor(
    @Inject(SMS_SERVICE) private smsClient: ClientProxy
  ) { }

  async sendRegisterSms() {
    const source = this.smsClient.send('smsClient/send_register_sms', {}).pipe(
      timeout(5000),
      catchError(err => {
        throw new Error(`Failed to send Sms: ${err.message}`);
      })
    );
    const data = await lastValueFrom(source);
    return data;
  }

  async sendForgotPasswordSms() {
    const source = this.smsClient.send('smsClient/send_forgot_sms', {}).pipe(
      timeout(5000),
      catchError(err => {
        throw new Error(`Failed to send Sms: ${err.message}`);
      })
    );
    const data = await lastValueFrom(source);
    return data;
  }
}