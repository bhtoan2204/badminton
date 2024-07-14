import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TimeoutError, lastValueFrom, timeout } from 'rxjs';
import { EDUCATION_SERVICE } from '../utils';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateEducationDto } from './dto/updateEducation.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NotificationType } from '@app/common';
import { CreateEducationDto } from './dto/createEducation.dto';

@Injectable()
export class EducationService {
  constructor(
    @Inject(EDUCATION_SERVICE) private educationClient: ClientProxy,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
  ) {}

  async createEducationProgress(id_user: string, dto: CreateEducationDto) {
    try {
      const response = this.educationClient
        .send('educationClient/createEducationProgress', { id_user, dto })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'New Education Progress',
          content: 'New education progress has been added to the family',
          type: NotificationType.EDUCATION,
          id_family: dto.id_family,
          id_target: data.data.id_education_progress,
        },
      });
      return data;
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
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
      const response = this.educationClient
        .send('educationClient/getAllEducationProgress', {
          id_user,
          pageNumber,
          itemsPerPage,
          id_family,
          search,
          member_id,
        })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getDetailEducationProgress(
    id_user: string,
    id_family: number,
    id_education_progress: number,
  ) {
    try {
      const response = this.educationClient
        .send('educationClient/getDetailEducationProgress', {
          id_user,
          id_family,
          id_education_progress,
        })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async updateDetailEducationProgress(
    id_user: string,
    dto: UpdateEducationDto,
  ) {
    try {
      const response = this.educationClient
        .send('educationClient/updateDetailEducationProgress', { id_user, dto })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'Education Progress Updated',
          content: 'An education progress has been updated in the family',
          type: NotificationType.EDUCATION,
          id_family: dto.id_family,
          id_target: dto.id_education_progress,
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

  async deleteEducationProgress(
    id_user: string,
    id_family: number,
    id_education_progress: number,
  ) {
    try {
      const response = this.educationClient
        .send('educationClient/deleteEducationProgress', {
          id_user,
          id_family,
          id_education_progress,
        })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      this.notificationsQueue.add('createNotificationFamily', {
        id_family,
        notificationData: {
          title: 'Education Progress Deleted',
          content: 'An education progress has been deleted in the family',
          type: NotificationType.EDUCATION,
          id_family,
          id_target: id_education_progress,
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
