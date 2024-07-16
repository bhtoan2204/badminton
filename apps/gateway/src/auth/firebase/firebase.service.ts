import { HttpException, Inject, Injectable } from '@nestjs/common';
import { AUTH_SERVICE } from '../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Injectable()
export class FirebaseService {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    private readonly rmqService: RmqService,
  ) {}

  async saveFCMToken(userId: string, fcmToken: string) {
    try {
      return await this.rmqService.send(
        this.authClient,
        'authClient/saveFCMToken',
        { userId, fcmToken },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async deleteFCMToken(userId: string, fcmToken: string) {
    try {
      const data = await this.rmqService.send(
        this.authClient,
        'authClient/deleteFCMToken',
        { userId, fcmToken },
      );
      return data;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }
}
