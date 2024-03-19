import { HttpException, Inject, Injectable } from "@nestjs/common";
import { MAILER_SERVICE } from "../utils";
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

  async sendInvitation(userInfo: any) {
    try {
      const response = this.mailerClient.send('mailClient/sendInvitation', { userInfo }).pipe(
        timeout(8000)
      );
      return await lastValueFrom(response);
    }
    catch (error) {
      throw new HttpException(error, error.statusCode);
    }
  }
}