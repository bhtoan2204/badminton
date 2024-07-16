import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ELASTICSEARCH_SERVICE, GUIDELINE_SERVICE } from '../utils';
import { ClientProxy } from '@nestjs/microservices';
import { CreateGuidelineDto } from './dto/createGuideline.dto';
import { UpdateGuidelineDto } from './dto/updateGuideline.dto';
import { AddStepGuidelineDto } from './dto/addStep.dto';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { NotificationType, RmqService } from '@app/common';

@Injectable()
export class GuidelineService {
  constructor(
    @Inject(GUIDELINE_SERVICE) private guidelineClient: ClientProxy,
    @Inject(ELASTICSEARCH_SERVICE) private elasticsearchClient: ClientProxy,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
    private readonly rmqService: RmqService,
  ) {}

  async getAllGuideline(
    id_user: string,
    id_family: number,
    page: number,
    itemsPerPage: number,
  ) {
    try {
      return await this.rmqService.send(
        this.guidelineClient,
        'guidelineClient/get_all_guideline',
        { id_user, id_family, page, itemsPerPage },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getGuideline(id_user: string, id_family: number, id_guideline: number) {
    try {
      return await this.rmqService.send(
        this.guidelineClient,
        'guidelineClient/get_guideline',
        { id_user, id_family, id_guideline },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async createGuideline(id_user: string, dto: CreateGuidelineDto) {
    try {
      const data = await this.rmqService.send(
        this.guidelineClient,
        'guidelineClient/create_guideline',
        { id_user, dto },
      );

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
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async updateGuideline(id_user: string, dto: UpdateGuidelineDto) {
    try {
      const data = await this.rmqService.send(
        this.guidelineClient,
        'guidelineClient/update_guideline',
        { id_user, dto },
      );

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
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async deleteGuideline(
    id_user: string,
    id_family: number,
    id_guideline: number,
  ) {
    try {
      const data = await this.rmqService.send(
        this.guidelineClient,
        'guidelineClient/delete_guideline',
        { id_user, id_family, id_guideline },
      );

      await this.notificationsQueue.add('createNotificationFamily', {
        id_family,
        notificationData: {
          title: 'Guideline Deleted',
          content: 'Guideline has been deleted',
          type: NotificationType.GUIDELINE,
          id_family,
          id_target: null,
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

  async getStep(id_user: string, id_family: number, id_guideline: number) {
    try {
      return await this.rmqService.send(
        this.guidelineClient,
        'guidelineClient/get_step',
        { id_user, id_family, id_guideline },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async addStep(
    id_user: string,
    dto: AddStepGuidelineDto,
    file: Express.Multer.File,
  ) {
    try {
      const data = await this.rmqService.send(
        this.guidelineClient,
        'guidelineClient/add_step',
        { id_user, dto, file },
      );

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
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async insertStep(
    id_user: string,
    dto: AddStepGuidelineDto,
    file: Express.Multer.File,
  ) {
    try {
      const data = await this.rmqService.send(
        this.guidelineClient,
        'guidelineClient/insert_step',
        { id_user, dto, file },
      );

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
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async updateStep(
    id_user: string,
    dto: AddStepGuidelineDto,
    file: Express.Multer.File,
  ) {
    try {
      const data = await this.rmqService.send(
        this.guidelineClient,
        'guidelineClient/update_step',
        { id_user, dto, file },
      );

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
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async deleteStep(
    id_user: string,
    id_family: number,
    id_guideline: number,
    index: number,
  ) {
    try {
      const data = await this.rmqService.send(
        this.guidelineClient,
        'guidelineClient/delete_step',
        { id_user, id_family, id_guideline, index },
      );

      await this.notificationsQueue.add('createNotificationFamily', {
        id_family,
        notificationData: {
          title: 'Step Deleted',
          content: 'Step has been deleted',
          type: NotificationType.GUIDELINE,
          id_family,
          id_target: id_guideline,
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

  async markShared(id_user: string, id_family: number, id_guideline: number) {
    try {
      const data = await this.rmqService.send(
        this.guidelineClient,
        'guidelineClient/mark_shared',
        { id_user, id_family, id_guideline },
      );

      await this.notificationsQueue.add('createNotificationFamily', {
        id_family,
        notificationData: {
          title: 'Guideline Shared',
          content: 'Guideline has been shared',
          type: NotificationType.GUIDELINE,
          id_family,
          id_target: id_guideline,
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

  async getSharedGuideline(
    page: number,
    itemsPerPage: number,
    text: string,
    sortBy?: string,
    sortDirection?: 'asc' | 'desc' | 'none',
  ) {
    try {
      return await this.rmqService.send(
        this.elasticsearchClient,
        'guidelineIndexer/searchGuideline',
        { page, itemsPerPage, text, sortBy, sortDirection },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getSharedGuidelineById(id_guideline: number) {
    try {
      return await this.rmqService.send(
        this.guidelineClient,
        'guidelineClient/getSharedGuidelineById',
        { id_guideline },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }
}
