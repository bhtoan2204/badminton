import { HttpException, Inject, Injectable } from "@nestjs/common";
import { NOTIFICATION_SERVICE } from "../utils";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom, timeout } from "rxjs";

@Injectable()
export class NotificationService {
  constructor(
    @Inject(NOTIFICATION_SERVICE) private readonly notificationClient: ClientProxy
  ) { }

  async getNotifications(id_user: string, index: number) {
    try {
      const response = this.notificationClient.send('notificationClient/getNotifications', { id_user, index }).pipe(timeout(5000));
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async createNotification(id_user: string, dto: any) {
    try {
      const response = this.notificationClient.send('notificationClient/createNotification', { id_user, dto }).pipe(timeout(5000));
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