import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CALENDAR_SERVICE } from '../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NotificationType, RmqService } from '@app/common';
import { CreateChecklistDto } from './dto/createChecklist.dto';
import { UpdateChecklistDto } from './dto/updateChecklist.dto';
import { GetCheckListDto } from './dto/getChecklist.dto';

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

  async getAllChecklist(id_user: string, dto: GetCheckListDto) {
    try {
      return await this.rmqService.send(
        this.calendarClient,
        'calendarClient/getAllChecklist',
        { id_user, dto },
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
          title_vn: 'Danh sách công việc mới được tạo',
          content: 'New Checklist has been created',
          content_vn: 'Danh sách công việc mới đã được tạo',
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
          title_vn: 'Danh sách công việc đã được cập nhật',
          content: 'Checklist has been updated',
          content_vn: 'Danh sách công việc đã được cập nhật',
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
          title_vn: 'Danh sách công việc đã bị xóa',
          content: 'Checklist has been deleted',
          content_vn: 'Danh sách công việc đã bị xóa',
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
