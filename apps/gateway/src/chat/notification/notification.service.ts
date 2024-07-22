import { HttpException, Inject, Injectable } from '@nestjs/common';
import { FAMILY_SERVICE, BACKGROUND_SERVICE } from '../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(BACKGROUND_SERVICE)
    private readonly notificationClient: ClientProxy,
    @Inject(FAMILY_SERVICE) private readonly familyClient: ClientProxy,
    private readonly rmqService: RmqService,
  ) {}

  async getNotifications(id_user: string, index: number) {
    try {
      return await this.rmqService.send(
        this.notificationClient,
        'backgroundClient/getNotifications',
        { id_user, index },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async markRead(id_user: string, id_notification: string) {
    try {
      return await this.rmqService.send(
        this.notificationClient,
        'backgroundClient/markRead',
        { id_user, id_notification },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async markAllRead(id_user: string) {
    try {
      return await this.rmqService.send(
        this.notificationClient,
        'backgroundClient/markAllRead',
        { id_user },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getListReceiverId(id_user: string, id_family: number) {
    try {
      return await this.rmqService.send(
        this.notificationClient,
        'familyClient/getIdsMember',
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
