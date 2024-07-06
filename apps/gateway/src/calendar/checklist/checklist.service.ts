import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CALENDAR_SERVICE } from '../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NotificationType } from '@app/common';
import { CreateChecklistDto } from './dto/createChecklist.dto';
import { UpdateChecklistDto } from './dto/updateChecklist.dto';

@Injectable()
export class ChecklistService {
  constructor(
    @Inject(CALENDAR_SERVICE) private readonly calendarClient: ClientProxy,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
  ) {}

  async getChecklistTypes() {
    try {
      const response = this.calendarClient
        .send('calendarClient/getChecklistTypes', {})
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

  async getAllChecklist(
    id_user: string,
    id_family: number,
    page: number,
    itemsPerPage: number,
  ) {
    try {
      const response = this.calendarClient
        .send('calendarClient/getAllChecklist', {
          id_user,
          id_family,
          page,
          itemsPerPage,
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

  async createChecklist(id_user: string, dto: CreateChecklistDto) {
    try {
      const response = this.calendarClient
        .send('calendarClient/createChecklist', { id_user, dto })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      await this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'New Checklist created',
          content: 'New Checklist has been created',
          type: NotificationType.CHECKLIST,
          id_family: dto.id_family,
          id_target: data.id_checklist,
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

  async updateChecklist(id_user: string, dto: UpdateChecklistDto) {
    try {
      const response = this.calendarClient
        .send('calendarClient/updateChecklist', { id_user, dto })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      await this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'Checklist updated',
          content: 'Checklist has been updated',
          type: NotificationType.CHECKLIST,
          id_family: dto.id_family,
          id_target: dto.id_checklist,
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

  async deleteChecklist(
    id_user: string,
    id_checklist: number,
    id_family: number,
  ) {
    try {
      const response = this.calendarClient
        .send('calendarClient/deleteChecklist', {
          id_user,
          id_checklist,
          id_family,
        })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      await this.notificationsQueue.add('createNotificationFamily', {
        id_family,
        notificationData: {
          title: 'Checklist deleted',
          content: 'Checklist has been deleted',
          type: NotificationType.CHECKLIST,
          id_family,
          id_target: id_checklist,
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
}
