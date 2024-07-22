import { HttpException, Inject, Injectable } from '@nestjs/common';
import { EDUCATION_SERVICE } from '../utils';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateEducationDto } from './dto/updateEducation.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NotificationType, RmqService } from '@app/common';
import { CreateEducationDto } from './dto/createEducation.dto';

@Injectable()
export class EducationService {
  constructor(
    @Inject(EDUCATION_SERVICE) private educationClient: ClientProxy,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
    private readonly rmqService: RmqService,
  ) {}

  async createEducationProgress(id_user: string, dto: CreateEducationDto) {
    try {
      const data = await this.rmqService.send(
        this.educationClient,
        'educationClient/createEducationProgress',
        { id_user, dto },
      );
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'New Education Progress',
          title_vn: 'Tiến trình học vụ mới',
          content: 'New education progress has been added to the family',
          content_vn: 'Tiến trình học vụ mới đã được thêm vào gia đình',
          type: NotificationType.EDUCATION,
          id_family: dto.id_family,
          id_target: data.data.id_education_progress,
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

  async getAllEducationProgress(
    id_user: string,
    pageNumber: number,
    itemsPerPage: number,
    id_family: number,
    search: string,
    member_id: string,
  ) {
    try {
      return this.rmqService.send(
        this.educationClient,
        'educationClient/getAllEducationProgress',
        {
          id_user,
          pageNumber,
          itemsPerPage,
          id_family,
          search,
          member_id,
        },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getDetailEducationProgress(
    id_user: string,
    id_family: number,
    id_education_progress: number,
  ) {
    try {
      return await this.rmqService.send(
        this.educationClient,
        'educationClient/getDetailEducationProgress',
        { id_user, id_family, id_education_progress },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async updateDetailEducationProgress(
    id_user: string,
    dto: UpdateEducationDto,
  ) {
    try {
      const data = await this.rmqService.send(
        this.educationClient,
        'educationClient/updateDetailEducationProgress',
        { id_user, dto },
      );
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'Education Progress Updated',
          title_vn: 'Tiến trình học vụ đã được cập nhật',
          content: 'An education progress has been updated in the family',
          content_vn: 'Tiến trình học vụ đã được cập nhật',
          type: NotificationType.EDUCATION,
          id_family: dto.id_family,
          id_target: dto.id_education_progress,
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

  async deleteEducationProgress(
    id_user: string,
    id_family: number,
    id_education_progress: number,
  ) {
    try {
      const data = await this.rmqService.send(
        this.educationClient,
        'educationClient/deleteEducationProgress',
        { id_user, id_family, id_education_progress },
      );
      this.notificationsQueue.add('createNotificationFamily', {
        id_family,
        notificationData: {
          title: 'Education Progress Deleted',
          title_vn: 'Tiến trình học vụ đã bị xóa',
          content: 'An education progress has been deleted in the family',
          content_vn: 'Tiến trình học vụ đã bị xóa',
          type: NotificationType.EDUCATION,
          id_family,
          id_target: id_education_progress,
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
