import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CALENDAR_SERVICE } from '../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NotificationType, RmqService } from '@app/common';
import { CreateChecklistDto } from './dto/createChecklist.dto';
import { UpdateChecklistDto } from './dto/updateChecklist.dto';

@Injectable()
export class ChecklistService {
  constructor(
    @Inject(CALENDAR_SERVICE) private readonly calendarClient: ClientProxy,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
    private readonly rmqService: RmqService,
  ) {}

  async getChecklistTypes() {
    try {
      return await this.rmqService.send(
        this.calendarClient,
        'calendarClient/getChecklistTypes',
        {},
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getAllChecklist(
    id_user: string,
    id_family: number,
    page: number,
    itemsPerPage: number,
  ) {
    try {
      return await this.rmqService.send(
        this.calendarClient,
        'calendarClient/getAllChecklist',
        { id_user, id_family, page, itemsPerPage },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async createChecklist(id_user: string, dto: CreateChecklistDto) {
    try {
      const data = await this.rmqService.send(
        this.calendarClient,
        'calendarClient/createChecklist',
        { id_user, dto },
      );
      this.notificationsQueue.add('createNotificationFamily', {
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
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async updateChecklist(id_user: string, dto: UpdateChecklistDto) {
    try {
      const data = await this.rmqService.send(
        this.calendarClient,
        'calendarClient/updateChecklist',
        { id_user, dto },
      );
      this.notificationsQueue.add('createNotificationFamily', {
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
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async deleteChecklist(
    id_user: string,
    id_checklist: number,
    id_family: number,
  ) {
    try {
      const data = await this.rmqService.send(
        this.calendarClient,
        'calendarClient/deleteChecklist',
        { id_user, id_checklist, id_family },
      );
      this.notificationsQueue.add('createNotificationFamily', {
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
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }
}
