import { HttpException, Inject, Injectable } from '@nestjs/common';
import { FINANCE_SERVICE } from '../../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NotificationType, RmqService } from '@app/common';
import { UpdateIncomeSourceDto } from './dto/updateIncomeSource.dto';

@Injectable()
export class IncomeSourceService {
  constructor(
    @Inject(FINANCE_SERVICE) private financeClient: ClientProxy,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
    private readonly rmqService: RmqService,
  ) {}

  async getIncomeSource(id_user: string, id_family: number) {
    try {
      return await this.rmqService.send(
        this.financeClient,
        'financeClient/getIncomeSource',
        { id_user, id_family },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async createIncomeSource(id_user: string, dto: any) {
    try {
      const data = await this.rmqService.send(
        this.financeClient,
        'financeClient/createIncomeSource',
        { id_user, dto },
      );
      this.notificationsQueue.add('createNotificationFamily', {
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
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async updateIncomeSource(id_user: string, dto: UpdateIncomeSourceDto) {
    try {
      const data = await this.rmqService.send(
        this.financeClient,
        'financeClient/updateIncomeSource',
        { id_user, dto },
      );
      this.notificationsQueue.add('createNotificationFamily', {
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
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async deleteIncomeSource(
    id_user: string,
    id_family: number,
    id_income_source: number,
  ) {
    try {
      const data = await this.rmqService.send(
        this.financeClient,
        'financeClient/deleteIncomeSource',
        {
          id_user,
          id_family,
          id_income_source,
        },
      );
      this.notificationsQueue.add('createNotificationFamily', {
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
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }
}
