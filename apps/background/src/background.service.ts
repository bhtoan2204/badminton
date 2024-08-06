import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import {
  CalendarResponse,
  Empty,
  FindCalendarByFrequencyRequest,
  FindOneByIdRequest,
  GerUserIdsRequest,
  NotificationData,
  NotificationType,
} from '@app/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  CALENDAR_EVENT_OCCURED_NON_REPEATLY,
  CALENDAR_EVENT_OCCURED_REPEATLY,
  CHECKLIST_OCCURED,
  FAMILY_PACKAGE_EXPIRED,
} from './constant';
import * as moment from 'moment';
import { FamilyService } from './family/family.service';
import { UserService } from './user/user.service';
import { CalendarService } from './calendar/calendar.service';

@Injectable()
@Processor('cron-queue')
export class BackgroundService implements OnModuleInit {
  constructor(
    @InjectQueue('cron-queue') private readonly cronQueue: Queue,
    @InjectQueue('chats') private readonly chatsQueue: Queue,
    @InjectModel(NotificationData.name)
    private notificationDataRepository: Model<NotificationData>,
    private readonly familyService: FamilyService,
    private readonly userService: UserService,
    private readonly calendarService: CalendarService,
  ) {}

  async createNotificationFamily(
    id_family: number,
    data: {
      type: NotificationType;
      title: string;
      title_vn: string;
      content: string;
      content_vn: string;
      id_target: string | number;
    },
  ) {
    try {
      const idsUserInFamilyRequest: GerUserIdsRequest = { idFamily: id_family };
      const idsUserInFamily = await this.familyService.getIdsUserInFamily(
        idsUserInFamilyRequest,
      );
      const userIds = idsUserInFamily.idUser;

      await Promise.all(
        userIds.map(async (userId) => {
          const notificationDetail = {
            _id: new Types.ObjectId(),
            title: data.title,
            title_vn: data.title_vn,
            content: data.content,
            content_vn: data.content_vn,
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
      throw error;
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
      throw error;
    }
  }

  async onModuleInit() {
    await this.addCalendarEventOccuredNonRepeatlyJob();
    await this.addFamilyPackageExpiredJob();
    await this.addChecklistNotificationJobs();
    await this.addCalendarEventOccuredRepeatlyJob();
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

  async addCalendarEventOccuredRepeatlyJob() {
    await this.cronQueue.add(
      CALENDAR_EVENT_OCCURED_REPEATLY,
      {},
      { repeat: { cron: '0 0 * * *' } },
    );
  }

  async addCalendarEventOccuredNonRepeatlyJob() {
    await this.cronQueue.add(
      CALENDAR_EVENT_OCCURED_NON_REPEATLY,
      {},
      { repeat: { cron: '0 0 * * *' } },
    );
  }

  @Process(CALENDAR_EVENT_OCCURED_NON_REPEATLY)
  async handleCalendarEventOccuredNonRepeatly() {
    try {
      const request: Empty = {};
      const calendarRpc =
        await this.calendarService.findNonRepeatCalendar(request);
      const nonRepeatEvents = calendarRpc;
      if (!nonRepeatEvents || nonRepeatEvents.length === 0) {
        return;
      }
      const nonRepeatEventsPromises = [];
      nonRepeatEvents.forEach(async (event) =>
        nonRepeatEventsPromises.push(
          this.createNotificationFamily(event.idFamily, {
            type: NotificationType.CALENDAR,
            title: `Reminder for event: ${event.title}`,
            title_vn: `Nhắc nhở cho sự kiện: ${event.title}`,
            content: `The event "${event.title}" is scheduled for ${moment(
              event.timeStart,
            ).format('MMMM Do YYYY, h:mm:ss a')}`,
            content_vn: `Sự kiện "${event.title}" được lên lịch vào lúc ${moment(
              event.timeEnd,
            ).format('MMMM Do YYYY, h:mm:ss a')}`,
            id_target: event.idCalendar,
          }),
        ),
      );
      await Promise.all(nonRepeatEventsPromises);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Process(CALENDAR_EVENT_OCCURED_REPEATLY)
  async handleCalendarEventOccured() {
    try {
      const request: FindCalendarByFrequencyRequest = { frequency: '' };
      const calendarRpc =
        await this.calendarService.findCalendarByFrequency(request);
      const repeatEvents = calendarRpc.calendar;
      if (!repeatEvents || repeatEvents.length === 0) {
        return;
      }
      const repeatEventsPromises = [];
      repeatEvents.forEach(async (event) =>
        repeatEventsPromises.push(
          this.createNotificationFamily(event.idFamily, {
            type: NotificationType.CALENDAR,
            title: `Reminder for event: ${event.title}`,
            title_vn: `Nhắc nhở cho sự kiện: ${event.title}`,
            content: `The event "${event.title}" is scheduled for ${moment(
              event.timeStart,
            ).format('MMMM Do YYYY, h:mm:ss a')}`,
            content_vn: `Sự kiện "${event.title}" được lên lịch vào lúc ${moment(
              event.timeEnd,
            ).format('MMMM Do YYYY, h:mm:ss a')}`,
            id_target: event.idCalendar,
          }),
        ),
      );
      await Promise.all(repeatEventsPromises);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Process('calendar_event_*_interval_*')
  async handleCalendarEventNotification(job: Job<{ eventId: number }>) {
    try {
      const id_calendar = job.data.eventId;
      const findOneRequest: FindOneByIdRequest = { idCalendar: id_calendar };
      const eventRpc: CalendarResponse =
        await this.calendarService.findCalendarById(findOneRequest);
      const event = eventRpc;
      if (event) {
        await this.createNotificationFamily(event.idCalendar, {
          type: NotificationType.CALENDAR,
          title: `Reminder for event: ${event.title}`,
          title_vn: `Nhắc nhở cho sự kiện: ${event.title}`,
          content: `The event "${event.title}" is scheduled for ${moment(
            event.timeStart,
          ).format('MMMM Do YYYY, h:mm:ss a')}`,
          content_vn: `Sự kiện "${event.title}" được lên lịch vào lúc ${moment(
            event.timeEnd,
          ).format('MMMM Do YYYY, h:mm:ss a')}`,
          id_target: event.idCalendar,
        });
        this.createNotificationFamily(event.idFamily, {
          type: NotificationType.CALENDAR,
          title: 'Reminder for event',
          title_vn: 'Nhắc nhở cho sự kiện',
          content: `The event "${event.title}" is scheduled for ${moment(event.timeStart).format('MMMM Do YYYY, h:mm:ss a')}`,
          content_vn: `Sự kiện "${event.title}" được lên lịch vào lúc ${moment(event.timeStart).format('MMMM Do YYYY, h:mm:ss a')}`,
          id_target: event.idCalendar,
        });
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Process(FAMILY_PACKAGE_EXPIRED)
  async handleFamilyPackageExpired() {
    try {
      const familiesRpc = await this.familyService.getExpiredFamilies({});
      const families = familiesRpc.families;

      await Promise.all(
        families.map((family) =>
          this.createNotificationFamily(family.id_family, {
            type: NotificationType.FAMILY,
            title: 'Family package expired',
            title_vn: 'Gói gia đình hết hạn',
            content: `Family package of family ${family.name} is going to expire in 3 days`,
            content_vn: `Gói gia đình của gia đình ${family.name} sắp hết hạn trong 3 ngày`,
            id_target: family.id_family,
          }),
        ),
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
