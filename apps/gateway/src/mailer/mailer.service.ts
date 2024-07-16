import { HttpException, Inject, Injectable } from '@nestjs/common';
import { AUTH_SERVICE } from '../utils';
import { ClientProxy } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Injectable()
export class MailService {
  constructor(
    @Inject(AUTH_SERVICE) private mailerClient: ClientProxy,
    private readonly rmqService: RmqService,
  ) {}

  async sendUserConfirmation(userInfo: any, email: string) {
    try {
      return await this.rmqService.send(
        this.mailerClient,
        'mailClient/sendUserConfirmation',
        { userInfo, email },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async sendInvitation(id_user: string, id_family: number) {
    try {
      return await this.rmqService.send(
        this.mailerClient,
        'mailClient/sendInvitation',
        { id_user, id_family },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }
}
