import { HttpException, Inject, Injectable } from '@nestjs/common';
import { AUTH_SERVICE } from '../utils';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';

@Injectable()
export class MailService {
  constructor(@Inject(AUTH_SERVICE) private mailerClient: ClientProxy) {}

  async sendUserConfirmation(userInfo: any, email: string) {
    try {
      const response = this.mailerClient
        .send('mailClient/sendUserConfirmation', { userInfo, email })
        .pipe(timeout(8000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async sendInvitation(id_user, id_family) {
    try {
      const response = this.mailerClient
        .send('mailClient/sendInvitation', { id_user, id_family })
        .pipe(timeout(8000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}
