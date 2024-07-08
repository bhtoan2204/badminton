import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ELASTICSEARCH_SERVICE, GUIDELINE_SERVICE } from '../utils';
import { ClientProxy } from '@nestjs/microservices';
import { TimeoutError, lastValueFrom, timeout } from 'rxjs';
import { CreateGuidelineDto } from './dto/createGuideline.dto';
import { UpdateGuidelineDto } from './dto/updateGuideline.dto';
import { AddStepGuidelineDto } from './dto/addStep.dto';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { NotificationType } from '@app/common';

@Injectable()
export class GuidelineService {
  constructor(
    @Inject(GUIDELINE_SERVICE) private guidelineClient: ClientProxy,
    @Inject(ELASTICSEARCH_SERVICE) private elasticsearchClient: ClientProxy,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
  ) {}

  async getAllGuideline(
    id_user: string,
    id_family: number,
    page: number,
    itemsPerPage: number,
  ) {
    try {
      const response = this.guidelineClient
        .send('guidelineClient/get_all_guideline', {
          id_user,
          id_family,
          page,
          itemsPerPage,
        })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getGuideline(id_user: string, id_family: number, id_guideline: number) {
    try {
      const response = this.guidelineClient
        .send('guidelineClient/get_guideline', {
          id_user,
          id_family,
          id_guideline,
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

  async createGuideline(id_user: string, dto: CreateGuidelineDto) {
    try {
      const response = this.guidelineClient
        .send('guidelineClient/create_guideline', { id_user, dto })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);

      await this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'New Guideline',
          content: 'New Guideline has been created',
          type: NotificationType.GUIDELINE,
          id_family: dto.id_family,
          id_target: data.data.id_guide_item,
        },
      });

      return data;
    } catch (error) {
      console.log(error.statusCode, error.message);
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async updateGuideline(id_user: string, dto: UpdateGuidelineDto) {
    try {
      const response = this.guidelineClient
        .send('guidelineClient/update_guideline', { id_user, dto })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      await this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'Guideline Updated',
          content: 'Guideline has been updated',
          type: NotificationType.GUIDELINE,
          id_family: dto.id_family,
          id_target: dto.id_guideline,
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

  async deleteGuideline(
    id_user: string,
    id_family: number,
    id_guideline: number,
  ) {
    try {
      const response = this.guidelineClient
        .send('guidelineClient/delete_guideline', {
          id_user,
          id_family,
          id_guideline,
        })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      await this.notificationsQueue.add('createNotificationFamily', {
        id_family: id_family,
        notificationData: {
          title: 'Guideline Deleted',
          content: 'Guideline has been deleted',
          type: NotificationType.GUIDELINE,
          id_family: id_family,
          id_target: null,
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

  async getStep(id_user: string, id_family: number, id_guideline: number) {
    try {
      const response = this.guidelineClient
        .send('guidelineClient/get_step', { id_user, id_family, id_guideline })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async addStep(
    id_user: string,
    dto: AddStepGuidelineDto,
    file: Express.Multer.File,
  ) {
    try {
      const response = this.guidelineClient
        .send('guidelineClient/add_step', { id_user, dto, file })
        .pipe(timeout(10000));
      const data = await lastValueFrom(response);
      await this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'New Step',
          content: 'New Step has been added',
          type: NotificationType.GUIDELINE,
          id_family: dto.id_family,
          id_target: dto.id_guideline,
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

  async insertStep(
    id_user: string,
    dto: AddStepGuidelineDto,
    file: Express.Multer.File,
  ) {
    try {
      const response = this.guidelineClient
        .send('guidelineClient/insert_step', { id_user, dto, file })
        .pipe(timeout(10000));
      const data = await lastValueFrom(response);
      await this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'New Step',
          content: 'New Step has been added',
          type: NotificationType.GUIDELINE,
          id_family: dto.id_family,
          id_target: dto.id_guideline,
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

  async updateStep(
    id_user: string,
    dto: AddStepGuidelineDto,
    file: Express.Multer.File,
  ) {
    try {
      const response = this.guidelineClient
        .send('guidelineClient/update_step', { id_user, dto, file })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      await this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'Step Updated',
          content: 'Step has been updated',
          type: NotificationType.GUIDELINE,
          id_family: dto.id_family,
          id_target: dto.id_guideline,
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

  async deleteStep(
    id_user: string,
    id_family: number,
    id_guideline: number,
    index: number,
  ) {
    try {
      const response = this.guidelineClient
        .send('guidelineClient/delete_step', {
          id_user,
          id_family,
          id_guideline,
          index,
        })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      await this.notificationsQueue.add('createNotificationFamily', {
        id_family: id_family,
        notificationData: {
          title: 'Step Deleted',
          content: 'Step has been deleted',
          type: NotificationType.GUIDELINE,
          id_family: id_family,
          id_target: id_guideline,
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

  async markShared(id_user: string, id_family: number, id_guideline: number) {
    try {
      const response = this.guidelineClient
        .send('guidelineClient/mark_shared', {
          id_user,
          id_family,
          id_guideline,
        })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      await this.notificationsQueue.add('createNotificationFamily', {
        id_family: id_family,
        notificationData: {
          title: 'Guideline Shared',
          content: 'Guideline has been shared',
          type: NotificationType.GUIDELINE,
          id_family: id_family,
          id_target: id_guideline,
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

  async getSharedGuideline(
    page: number,
    itemsPerPage: number,
    text: string,
    sortBy?: string,
    sortDirection?: 'asc' | 'desc' | 'none',
  ) {
    try {
      const response = this.elasticsearchClient
        .send('guidelineIndexer/searchGuideline', {
          page,
          itemsPerPage,
          text,
          sortBy,
          sortDirection,
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

  async getSharedGuidelineById(id_guideline: number) {
    try {
      const response = this.guidelineClient
        .send('guidelineClient/getSharedGuidelineById', { id_guideline })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}
