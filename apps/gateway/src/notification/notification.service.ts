import { HttpException, Inject, Injectable } from "@nestjs/common";
import { FAMILY_SERVICE, NOTIFICATION_SERVICE } from "../utils";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom, timeout } from "rxjs";

@Injectable()
export class NotificationService {
  constructor(
    @Inject(NOTIFICATION_SERVICE) private readonly notificationClient: ClientProxy,
    @Inject(FAMILY_SERVICE) private readonly familyClient: ClientProxy
  ) { }

  async getNotifications(id_user: string, index: number) {
    try {
      const response = this.notificationClient.send('notificationClient/getNotifications', { id_user, index }).pipe(timeout(15000));
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async createNotification(id_user: string, dto: any, listReceiverId: string[]) {
    try {
      const response = this.notificationClient.send('notificationClient/createNotification', { id_user, dto, listReceiverId }).pipe(timeout(15000));
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async markRead(id_user: string, id_notification: string) {
    try {
      const response = this.notificationClient.send('notificationClient/markRead', { id_user, id_notification }).pipe(timeout(15000));
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getListReceiverId(id_user: string, id_family: number) {
    try {
      const response = this.familyClient.send('family/getIdsMember', { id_user, id_family });
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}