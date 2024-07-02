import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Queue } from 'bull';
import {
  Family,
  MemberFamily,
  NotificationData,
  NotificationType,
} from '@app/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FAMILY_PACKAGE_EXPIRED } from './constant';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import * as moment from 'moment';

@Injectable()
@Processor('cron-queue')
export class BackgroundService implements OnModuleInit {
  constructor(
    @InjectQueue('cron-queue') private readonly cronQueue: Queue,
    @InjectQueue('chats') private readonly chatsQueue: Queue,
    @InjectModel(NotificationData.name)
    private notificationDataRepository: Model<NotificationData>,
    @InjectRepository(Family) private familyRepository: Repository<Family>,
    @InjectRepository(MemberFamily)
    private memberFamilyRepository: Repository<MemberFamily>,
  ) {}

  async createNotificationFamily(
    id_family: number,
    data: {
      type: NotificationType;
      title: string;
      content: string;
      id_target: string | number;
    },
  ) {
    try {
      const memberFamilies = await this.memberFamilyRepository.find({
        where: {
          id_family,
        },
      });
      const userIds = memberFamilies.map(
        (memberFamily) => memberFamily.id_user,
      );

      await Promise.all(
        userIds.map(async (userId) => {
          const notificationDetail = {
            _id: new Types.ObjectId(),
            title: data.title,
            content: data.content,
            type: data.type,
            id_family,
            id_target: data.id_target,
          };
          await this.notificationDataRepository.updateOne(
            { id_user: userId },
            { $push: { notificationArr: notificationDetail } },
            { upsert: true },
          );
          await this.chatsQueue.add('sendNotification', {
            id_user: userId,
            notification: notificationDetail,
          });
        }),
      );
    } catch (error) {
      console.error(error);
    }
  }

  async createNotificationUser(
    id_user: string,
    data: {
      type: NotificationType;
      title: string;
      content: string;
      id_target: string | number;
    },
  ) {
    try {
      const notificationDetail = {
        _id: new Types.ObjectId(),
        title: data.title,
        content: data.content,
        type: data.type,
        id_target: data.id_target,
      };

      await this.notificationDataRepository.updateOne(
        { id_user },
        { $push: { notificationArr: notificationDetail } },
        { upsert: true },
      );
    } catch (error) {
      console.error(error);
    }
  }

  async onModuleInit() {
    await this.addFamilyPackageExpiredJob();
  }

  async addFamilyPackageExpiredJob() {
    // Cron expression for 12:00 AM every day
    await this.cronQueue.add(
      FAMILY_PACKAGE_EXPIRED,
      {},
      { repeat: { cron: '0 0 * * *' } },
    );
  }

  @Process(FAMILY_PACKAGE_EXPIRED)
  async handleFamilyPackageExpired() {
    try {
      const oneDayLater = moment().add(3, 'days').toDate();

      const families = await this.familyRepository.find({
        where: {
          expired_at: LessThan(oneDayLater),
        },
      });

      await Promise.all(
        families.map((family) =>
          this.createNotificationFamily(family.id_family, {
            type: NotificationType.FAMILY,
            title: 'Family package expired',
            content: `Family package of family ${family.name} is going to expire in 3 days`,
            id_target: family.id_family,
          }),
        ),
      );
    } catch (error) {
      console.error(error);
    }
  }
}
