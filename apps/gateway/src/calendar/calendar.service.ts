import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CALENDAR_SERVICE } from '../utils';
import { ClientProxy } from '@nestjs/microservices';
import { CreateCalendarDto } from './dto/createCalendar.dto';
import { lastValueFrom, timeout } from 'rxjs';
import { UpdateCalendarDto } from './dto/updateCalendar.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NotificationType } from '@app/common';
import { CreateCategoryEventDto } from './dto/createCategoryEvent.dto';

@Injectable()
export class CalendarService {
  constructor(
    @Inject(CALENDAR_SERVICE) private readonly calendarClient: ClientProxy,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
  ) {}

  async getAllCategoryEvent(id_user: string, id_family: number) {
    try {
      const response = this.calendarClient
        .send('calendarClient/getAllCategoryEvent', { id_user, id_family })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async createCategoryEvent(id_user: string, dto: CreateCategoryEventDto) {
    try {
      const response = this.calendarClient
        .send('calendarClient/createCategoryEvent', { id_user, dto })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'New Category Event',
          content: 'New Category Event has been created',
          type: NotificationType.CALENDAR,
          id_family: dto.id_family,
          id_target: data[0].id_category_event,
        },
      });
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async updateCategoryEvent(id_user: string, dto: any) {
    try {
      const response = this.calendarClient
        .send('calendarClient/updateCategoryEvent', { id_user, dto })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async deleteCategoryEvent(
    id_user: string,
    id_family: number,
    id_category_event: number,
  ) {
    try {
      const response = this.calendarClient
        .send('calendarClient/deleteCategoryEvent', {
          id_user,
          id_family,
          id_category_event,
        })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getAllCalendar(id_user: string, id_family: number) {
    try {
      const response = this.calendarClient
        .send('calendarClient/getAllCalendar', { id_user, id_family })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getCalendarDetail(
    id_user: string,
    id_calendar: number,
    id_family: number,
  ) {
    try {
      const response = this.calendarClient
        .send('calendarClient/getCalendarDetail', {
          id_user,
          id_calendar,
          id_family,
        })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async createCalendar(id_user: string, dto: CreateCalendarDto) {
    try {
      const response = this.calendarClient
        .send('calendarClient/createCalendar', { id_user, dto })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'New Calendar Event Created',
          content: 'New Category Event has been created',
          type: NotificationType.CALENDAR,
          id_family: dto.id_family,
          id_target: data.data.id_calendar,
        },
      });
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async updateCalendar(id_user: string, dto: UpdateCalendarDto) {
    try {
      const response = this.calendarClient
        .send('calendarClient/updateCalendar', { id_user, dto })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async deleteCalendar(
    id_user: string,
    id_calendar: number,
    id_family: number,
  ) {
    try {
      const response = this.calendarClient
        .send('calendarClient/deleteCalendar', {
          id_user,
          id_calendar,
          id_family,
        })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}
