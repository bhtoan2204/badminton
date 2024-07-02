import { HttpException, Inject, Injectable } from '@nestjs/common';
import { FAMILY_SERVICE, BACKGROUND_SERVICE } from '../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(BACKGROUND_SERVICE)
    private readonly notificationClient: ClientProxy,
    @Inject(FAMILY_SERVICE) private readonly familyClient: ClientProxy,
  ) {}

  async getNotifications(id_user: string, index: number) {
    try {
      const response = this.notificationClient
        .send('backgroundClient/getNotifications', { id_user, index })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async markRead(id_user: string, id_notification: string) {
    try {
      const response = this.notificationClient
        .send('backgroundClient/markRead', { id_user, id_notification })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getListReceiverId(id_user: string, id_family: number) {
    try {
      const response = this.familyClient.send('familyClient/getIdsMember', {
        id_user,
        id_family,
      });
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}
