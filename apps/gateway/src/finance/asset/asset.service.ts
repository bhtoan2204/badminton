import { HttpException, Inject, Injectable } from '@nestjs/common';
import { FINANCE_SERVICE } from '../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { CreateAssetDto } from './dto/createAsset.dto';
import { UpdateAssetDto } from './dto/updateAsset.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NotificationType, RmqService } from '@app/common';

@Injectable()
export class AssetService {
  constructor(
    @Inject(FINANCE_SERVICE) private financeClient: ClientProxy,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
    private readonly rmqService: RmqService,
  ) {}

  async getAsset(
    id_user: string,
    id_family: number,
    page: number,
    itemsPerPage: number,
  ) {
    try {
      return await this.rmqService.send(
        this.financeClient,
        'financeClient/getAsset',
        {
          id_user,
          id_family,
          page,
          itemsPerPage,
        },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async createAsset(
    id_user: string,
    dto: CreateAssetDto,
    file: Express.Multer.File,
  ) {
    try {
      const data = await this.rmqService.send(
        this.financeClient,
        'financeClient/createAsset',
        { id_user, dto, file },
      );
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'Asset Created',
          title_vn: 'Tài sản mới',
          content: 'New asset has been created in your family',
          content_vn: 'Tài sản mới đã được tạo trong gia đình của bạn',
          type: NotificationType.ASSET,
          id_family: dto.id_family,
          id_target: data.id_asset,
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

  async updateAsset(
    id_user: string,
    dto: UpdateAssetDto,
    file: Express.Multer.File,
  ) {
    try {
      const data = await this.rmqService.send(
        this.financeClient,
        'financeClient/updateAsset',
        { id_user, dto, file },
      );
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'Asset Updated',
          title_vn: 'Tài sản đã được cập nhật',
          content: 'Asset has been updated in your family',
          content_vn: 'Tài sản đã được cập nhật trong gia đình của bạn',
          type: NotificationType.ASSET,
          id_family: dto.id_family,
          id_target: dto.id_asset,
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

  async deleteAsset(id_user: string, id_family, id_asset: number) {
    try {
      const data = await this.rmqService.send(
        this.financeClient,
        'financeClient/deleteAsset',
        { id_user, id_family, id_asset },
      );
      this.notificationsQueue.add('createNotificationFamily', {
        id_family,
        notificationData: {
          title: 'Asset Deleted',
          title_vn: 'Tài sản đã bị xóa',
          content: 'Asset has been deleted in your family',
          content_vn: 'Tài sản đã bị xóa trong gia đình của bạn',
          type: NotificationType.ASSET,
          id_family,
          id_target: id_asset,
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
