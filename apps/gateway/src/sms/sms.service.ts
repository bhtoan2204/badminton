import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { SMS_SERVICE } from "apps/gateway/constant/services.constant";
import { catchError, lastValueFrom, timeout } from "rxjs";
import { ValidatePhoneDto } from "./dto/validatePhone";

@Injectable()
export class SmsService {
  constructor(
    @Inject(SMS_SERVICE) private smsClient: ClientProxy
  ) { }

  async sendValidatePhoneSms(validateDate: ValidatePhoneDto) {
    try {
      const source = this.smsClient.send('smsClient/sendValidatePhoneSms', validateDate).pipe(
        timeout(5000),
        catchError(err => {
          throw err;
        })
      );
      const data = await lastValueFrom(source);
      return data;
    }
    catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}