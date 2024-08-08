import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { NotificationService } from './notification.service';
import { Job, Queue } from 'bull';
import { InjectModel } from '@nestjs/mongoose';
import {
  GetUserRequest,
  GetUserResponse,
  NotificationData,
  NotificationType,
} from '@app/common';
import { UserService } from '../user/user.service';

export interface NotificationDataInterface {
  title: string;
  title_vn: string;
  content: string;
  content_vn: string;
  type: NotificationType;
  id_family?: number;
  id_target: string | number;
}

@Processor('notifications')
export class NotificationProcessor {
  constructor(
    private readonly notificationService: NotificationService,
    @InjectModel(NotificationData.name) private readonly notificationRepository,
    @InjectQueue('chats') private readonly chatsQueue: Queue,
    private readonly userService: UserService,
  ) {}

  @Process('createNotificationFamily')
  async createNotificationFamily(job: Job) {
    try {
      const id_family: number = job.data.id_family;
      const content: NotificationDataInterface = job.data.notificationData;
      console.log(content);
      await this.notificationService.createNotificationProcessorFamily(
        id_family,
        content,
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Process('createNotificationUser')
  async createNotificationUser(job: Job) {
    try {
      const id_user: string = job.data.id_user;
      const content: NotificationDataInterface = job.data.notificationData;
      const notificationDetail =
        await this.notificationService.createNotificationProcessorUser(
          id_user,
          content,
        );
      const requestUser: GetUserRequest = {
        idUser: id_user,
      };
      const user: GetUserResponse = await this.userService.findOne(requestUser);
      const userInfo = user
        ? {
            name: `${user.firstname} ${user.lastname}`,
            avatar: user.avatar,
          }
        : null;
      await this.chatsQueue.add('sendNotification', {
        id_user: id_user,
        notification: { userInfo, ...notificationDetail },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
