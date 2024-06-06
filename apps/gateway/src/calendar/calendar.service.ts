import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CALENDAR_SERVICE } from '../utils';
import { ClientProxy } from '@nestjs/microservices';
import { CreateCalendarDto } from './dto/createCalendar.dto';
import { lastValueFrom, timeout } from 'rxjs';
import { UpdateCalendarDto } from './dto/updateCalendar.dto';

@Injectable()
export class CalendarService {
  constructor(
    @Inject(CALENDAR_SERVICE) private readonly calendarClient: ClientProxy,
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

  async createCategoryEvent(id_user: string, dto: any) {
    try {
      const response = this.calendarClient
        .send('calendarClient/createCategoryEvent', { id_user, dto })
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

  async getEventOnDate(id_user: string, dto) {
    try {
      const response = this.calendarClient
        .send('calendarClient/getEventOnDate', { id_user, dto })
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

  async getCalendarDetail(id_user: string, id_calendar: number) {
    try {
      const response = this.calendarClient
        .send('calendarClient/getCalendarDetail', { id_user, id_calendar })
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

  async deleteCalendar(id_user: string, id_calendar: number) {
    try {
      const response = this.calendarClient
        .send('calendarClient/deleteCalendar', { id_user, id_calendar })
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
