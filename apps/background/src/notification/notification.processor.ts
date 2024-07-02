import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { NotificationService } from './notification.service';
import { Job, Queue } from 'bull';
import { InjectModel } from '@nestjs/mongoose';
import { NotificationData, NotificationType } from '@app/common';

export interface NotificationDataInterface {
  title: string;
  content: string;
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
  ) {}

  @Process('createNotificationFamily')
  async createNotificationFamily(job: Job) {
    try {
      const id_family: number = job.data.id_family;
      const content: NotificationDataInterface = job.data.notificationData;
      await this.notificationService.createNotificationProcessorFamily(
        id_family,
        content,
      );
    } catch (error) {
      console.log(error);
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
      await this.chatsQueue.add('sendNotification', {
        id_user: id_user,
        notification: notificationDetail,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
