import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Queue } from 'bull';
import {
  Checklist,
  Family,
  MemberFamily,
  NotificationData,
  NotificationType,
} from '@app/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  CALENDAR_EVENT_OCCURED,
  CHECKLIST_OCCURED,
  EXPENSE_REPORT,
  FAMILY_PACKAGE_EXPIRED,
  INCOME_REPORT,
} from './constant';
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
    @InjectRepository(Checklist)
    private checklistRepository: Repository<Checklist>,
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
    await this.addChecklistNotificationJobs();
    await this.addIncomeReportJob();
    await this.addExpenseReportJob();
    await this.addCalendarEventOccuredJob();
  }

  async addFamilyPackageExpiredJob() {
    // Cron expression for 12:00 AM every day
    await this.cronQueue.add(
      FAMILY_PACKAGE_EXPIRED,
      {},
      { repeat: { cron: '0 0 * * *' } },
    );
  }

  async addChecklistNotificationJobs() {
    // Cron expression for every 10 minutes
    await this.cronQueue.add(
      CHECKLIST_OCCURED,
      {},
      { repeat: { cron: '*/10 * * * *' } },
    );
  }

  async addIncomeReportJob() {
    // Cron expression for the last day of each month at 12:00 AM
    await this.cronQueue.add(
      INCOME_REPORT,
      {},
      { repeat: { cron: '0 0 L * *' } },
    );
  }

  async addExpenseReportJob() {
    // Cron expression for the last day of each month at 12:00 AM
    await this.cronQueue.add(
      EXPENSE_REPORT,
      {},
      { repeat: { cron: '0 0 L * *' } },
    );
  }

  async addCalendarEventOccuredJob() {
    // Cron expression for every 10 minutes
    await this.cronQueue.add(
      CALENDAR_EVENT_OCCURED,
      {},
      { repeat: { cron: '*/10 * * * *' } },
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

  @Process(CALENDAR_EVENT_OCCURED)
  async handleCalendarEventOccured() {
    try {
    } catch (error) {
      console.error(error);
    }
  }

  @Process(CHECKLIST_OCCURED)
  async handleChecklistOccured() {
    try {
      const now = moment();
      const threeDaysBefore = now.clone().add(3, 'days').toDate();
      const oneDayBefore = now.clone().add(1, 'days').toDate();

      const checklists = await this.checklistRepository.find({
        where: [
          {
            due_date: LessThan(threeDaysBefore),
            is_notified_3_days_before: false,
          },
          { due_date: LessThan(oneDayBefore), is_notified_1_day_before: false },
          { due_date: LessThan(now.toDate()), is_notified_on_due_date: false },
        ],
      });

      console.log('checklists', checklists);

      await Promise.all(
        checklists.map(async (checklist) => {
          const notifications = [];
          const now = moment();
          const dueDate = moment(checklist.due_date);

          if (
            dueDate.isSame(now.clone().add(3, 'days'), 'day') &&
            !checklist.is_notified_3_days_before
          ) {
            notifications.push(
              this.createNotificationFamily(checklist.id_family, {
                type: NotificationType.CHECKLIST,
                title: 'Checklist due in 3 days',
                content: `Checklist "${checklist.task_name}" is due in 3 days`,
                id_target: checklist.id_checklist,
              }),
            );
            checklist.is_notified_3_days_before = true;
          }
          if (
            dueDate.isSame(now.clone().add(1, 'days'), 'day') &&
            !checklist.is_notified_1_day_before
          ) {
            notifications.push(
              this.createNotificationFamily(checklist.id_family, {
                type: NotificationType.CHECKLIST,
                title: 'Checklist due tomorrow',
                content: `Task "${checklist.task_name}" is due tomorrow`,
                id_target: checklist.id_checklist,
              }),
            );
            checklist.is_notified_1_day_before = true;
          }

          if (
            dueDate.isSame(now, 'day') &&
            !checklist.is_notified_on_due_date
          ) {
            notifications.push(
              this.createNotificationFamily(checklist.id_family, {
                type: NotificationType.CHECKLIST,
                title: 'Checklist due today',
                content: `Task "${checklist.task_name}" is due today`,
                id_target: checklist.id_checklist,
              }),
            );
            checklist.is_notified_on_due_date = true;
          }

          await Promise.all(notifications);
          await this.checklistRepository.save(checklist);
        }),
      );
    } catch (error) {
      console.error(error);
    }
  }

  @Process(EXPENSE_REPORT)
  async handleExpenseReport() {
    try {
    } catch (error) {
      console.error(error);
    }
  }

  @Process(INCOME_REPORT)
  async handleIncomeReport() {
    try {
    } catch (error) {
      console.error(error);
    }
  }
}
