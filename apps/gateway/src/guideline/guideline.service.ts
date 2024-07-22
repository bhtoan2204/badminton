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
          title_vn: 'Hướng dẫn mới',
          content: 'New Guideline has been created',
          content_vn: 'Hướng dẫn mới đã được tạo',
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
          title_vn: 'Hướng dẫn đã được cập nhật',
          content: 'Guideline has been updated',
          content_vn: 'Hướng dẫn đã được cập nhật',
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
          title_vn: 'Hướng dẫn đã bị xóa',
          content: 'Guideline has been deleted',
          content_vn: 'Hướng dẫn đã bị xóa',
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
          title_vn: 'Bước mới',
          content: 'New Step has been added',
          content_vn: 'Bước mới đã được thêm',
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
          title_vn: 'Bước mới',
          content: 'New Step has been added',
          content_vn: 'Bước mới đã được thêm',
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
          title_vn: 'Bước đã được cập nhật',
          content: 'Step has been updated',
          content_vn: 'Bước đã được cập nhật',
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
          title_vn: 'Bước đã bị xóa',
          content: 'Step has been deleted',
          content_vn: 'Bước đã bị xóa',
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
          title_vn: 'Hướng dẫn đã được chia sẻ',
          content: 'Guideline has been shared',
          content_vn: 'Hướng dẫn đã được chia sẻ ra cộng đồng ',
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
