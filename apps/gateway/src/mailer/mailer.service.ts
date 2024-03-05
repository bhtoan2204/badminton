import { HttpException, Inject, Injectable } from "@nestjs/common";
import { MAILER_SERVICE } from "../utils/constant/services.constant";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom, timeout } from "rxjs";

@Injectable()
export class MailService {
  constructor(
    @Inject(MAILER_SERVICE) private mailerClient: ClientProxy
  ) {}

  async sendUserConfirmation(userInfo: any, email: string) {
    try {
      const response = this.mailerClient.send('mailClient/sendUserConfirmation', { userInfo, email }).pipe(
        timeout(8000)
      );
      return await lastValueFrom(response);
    }
    catch (error) {
      throw new HttpException(error, error.statusCode);
    }
  }
}