import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CALENDAR_SERVICE } from '../utils';
import { ClientProxy } from '@nestjs/microservices';
import { CreateCalendarDto } from './dto/createCalendar.dto';
import { UpdateCalendarDto } from './dto/updateCalendar.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NotificationType, RmqService } from '@app/common';
import { CreateCategoryEventDto } from './dto/createCategoryEvent.dto';

@Injectable()
export class CalendarService {
  constructor(
    @Inject(CALENDAR_SERVICE) private readonly calendarClient: ClientProxy,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
    private readonly rmqService: RmqService,
  ) {}

  async getAllCategoryEvent(id_user: string, id_family: number) {
    try {
      return await this.rmqService.send(
        this.calendarClient,
        'calendarClient/getAllCategoryEvent',
        { id_user, id_family },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async createCategoryEvent(id_user: string, dto: CreateCategoryEventDto) {
    try {
      const data = await this.rmqService.send(
        this.calendarClient,
        'calendarClient/createCategoryEvent',
        { id_user, dto },
      );
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'New Category Event',
          title_vn: 'Loại sự kiện mới',
          content: 'New Category Event has been created',
          content_vn: 'Loại sự kiện mới đã được tạo',
          type: NotificationType.CALENDAR,
          id_family: dto.id_family,
          id_target: data[0].id_category_event,
        },
      });
      return data;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async updateCategoryEvent(id_user: string, dto: any) {
    try {
      return await this.rmqService.send(
        this.calendarClient,
        'calendarClient/updateCategoryEvent',
        { id_user, dto },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async deleteCategoryEvent(
    id_user: string,
    id_family: number,
    id_category_event: number,
  ) {
    try {
      return await this.rmqService.send(
        this.calendarClient,
        'calendarClient/deleteCategoryEvent',
        { id_user, id_family, id_category_event },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getAllCalendar(id_user: string, id_family: number) {
    try {
      return await this.rmqService.send(
        this.calendarClient,
        'calendarClient/getAllCalendar',
        { id_user, id_family },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getCalendarDetail(
    id_user: string,
    id_calendar: number,
    id_family: number,
  ) {
    try {
      return await this.rmqService.send(
        this.calendarClient,
        'calendarClient/getCategoryEventByCalendar',
        { id_user, id_calendar, id_family },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async createCalendar(id_user: string, dto: CreateCalendarDto) {
    try {
      const data = await this.rmqService.send(
        this.calendarClient,
        'calendarClient/createCalendar',
        { id_user, dto },
      );
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'New Calendar Event Created',
          title_vn: 'Sự kiện mới đã được tạo',
          content: 'New Category Event has been created',
          content_vn: 'Sự kiện mới đã được tạo',
          type: NotificationType.CALENDAR,
          id_family: dto.id_family,
          id_target: data.data.id_calendar,
        },
      });
      return data;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async updateCalendar(id_user: string, dto: UpdateCalendarDto) {
    try {
      return await this.rmqService.send(
        this.calendarClient,
        'calendarClient/getCategoryEventByCalendar',
        { id_user, id_calendar: dto.id_calendar, id_family: dto.id_family },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async deleteCalendar(
    id_user: string,
    id_calendar: number,
    id_family: number,
  ) {
    try {
      return await this.rmqService.send(
        this.calendarClient,
        'calendarClient/deleteCalendar',
        { id_user, id_calendar, id_family },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }
}
