import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FINANCE_SERVICE } from '../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { CreateAssetDto } from './dto/createAsset.dto';
import { TimeoutError, lastValueFrom, timeout } from 'rxjs';
import { UpdateAssetDto } from './dto/updateAsset.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NotificationType } from '@app/common';

@Injectable()
export class AssetService {
  constructor(
    @Inject(FINANCE_SERVICE) private financeClient: ClientProxy,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
  ) {}

  async getAsset(
    id_user: string,
    id_family: number,
    page: number,
    itemsPerPage: number,
  ) {
    try {
      const response = this.financeClient
        .send('financeClient/getAsset', {
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

  async createAsset(
    id_user: string,
    dto: CreateAssetDto,
    file: Express.Multer.File,
  ) {
    try {
      const response = this.financeClient
        .send('financeClient/createAsset', { id_user, dto, file })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      await this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'Asset Created',
          content: 'New asset has been created in your family',
          type: NotificationType.ASSET,
          id_family: dto.id_family,
          id_target: data.id_asset,
        },
      });
      return data;
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async updateAsset(
    id_user: string,
    dto: UpdateAssetDto,
    file: Express.Multer.File,
  ) {
    try {
      const response = this.financeClient
        .send('financeClient/updateAsset', { id_user, dto, file })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      await this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'Asset Updated',
          content: 'Asset has been updated in your family',
          type: NotificationType.ASSET,
          id_family: dto.id_family,
          id_target: dto.id_asset,
        },
      });
      return data;
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async deleteAsset(id_user: string, id_family, id_asset: number) {
    try {
      const response = this.financeClient
        .send('financeClient/deleteAsset', { id_user, id_family, id_asset })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      await this.notificationsQueue.add('createNotificationFamily', {
        id_family,
        notificationData: {
          title: 'Asset Deleted',
          content: 'Asset has been deleted in your family',
          type: NotificationType.ASSET,
          id_family,
          id_target: id_asset,
        },
      });
      return data;
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}
