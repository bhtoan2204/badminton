import { HttpException, Inject, Injectable } from '@nestjs/common';
import { FINANCE_SERVICE } from '../../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NotificationType } from '@app/common';
import { UpdateIncomeSourceDto } from './dto/updateIncomeSource.dto';

@Injectable()
export class IncomeSourceService {
  constructor(
    @Inject(FINANCE_SERVICE) private financeClient: ClientProxy,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
  ) {}

  async getIncomeSource(id_user: string, id_family: number) {
    try {
      const response = this.financeClient
        .send('financeClient/getIncomeSource', { id_user, id_family })
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

  async createIncomeSource(id_user: string, dto: any) {
    try {
      const response = this.financeClient
        .send('financeClient/createIncomeSource', { id_user, dto })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      await this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'New Income Source created',
          content: 'New Income Source has been created',
          type: NotificationType.INCOME_SOURCE,
          id_family: dto.id_family,
          id_target: data.id_income_source,
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

  async updateIncomeSource(id_user: string, dto: UpdateIncomeSourceDto) {
    try {
      const response = this.financeClient
        .send('financeClient/updateIncomeSource', { id_user, dto })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      await this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'Income Source updated',
          content: 'Income Source has been updated',
          type: NotificationType.INCOME_SOURCE,
          id_family: dto.id_family,
          id_target: dto.id_income_source,
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

  async deleteIncomeSource(
    id_user: string,
    id_family: number,
    id_income_source: number,
  ) {
    try {
      const response = this.financeClient
        .send('financeClient/deleteIncomeSource', {
          id_user,
          id_family,
          id_income_source,
        })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      await this.notificationsQueue.add('createNotificationFamily', {
        id_family: id_family,
        notificationData: {
          title: 'Income Source deleted',
          content: 'Income Source has been deleted',
          type: NotificationType.INCOME_SOURCE,
          id_family: id_family,
          id_target: id_income_source,
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
