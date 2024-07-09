import { HttpException, Inject, Injectable } from '@nestjs/common';
import { FINANCE_SERVICE } from '../../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { CreateExpenseditureTypeDto } from './dto/createExpenseditureType.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NotificationType } from '@app/common';
import { UpdateExpenseditureTypeDto } from './dto/updateExpenseditureType.dto';

@Injectable()
export class ExpenseditureTypeService {
  constructor(
    @Inject(FINANCE_SERVICE) private financeClient: ClientProxy,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
  ) {}

  async getExpenseditureType(
    id_user: string,
    id_family: number,
    page: number,
    itemsPerPage: number,
  ) {
    try {
      const response = this.financeClient
        .send('financeClient/getExpenseditureType', {
          id_user,
          id_family,
          page,
          itemsPerPage,
        })
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

  async createExpenseditureType(
    id_user: string,
    dto: CreateExpenseditureTypeDto,
  ) {
    try {
      const response = this.financeClient
        .send('financeClient/createExpenseditureType', { id_user, dto })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'New Expenditure Type',
          content: 'New Expenditure Type has been created',
          type: NotificationType.EXPENSE_TYPE,
          id_family: dto.id_family,
          id_target: data.id_expenditure_type,
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

  async updateExpenseditureType(
    id_user: string,
    dto: UpdateExpenseditureTypeDto,
  ) {
    try {
      const response = this.financeClient
        .send('financeClient/updateExpenseditureType', { id_user, dto })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'Expenditure Type updated',
          content: 'Expenditure Type has been updated',
          type: NotificationType.EXPENSE_TYPE,
          id_family: dto.id_family,
          id_target: dto.id_expenditure_type,
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

  async deleteExpenseditureType(
    id_user: string,
    id_family: number,
    id_expenditure_type: number,
  ) {
    try {
      const response = this.financeClient
        .send('financeClient/deleteExpenseditureType', {
          id_user,
          id_family,
          id_expenditure_type,
        })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: id_family,
        notificationData: {
          title: 'Expenditure Type deleted',
          content: 'Expenditure Type has been deleted',
          type: NotificationType.EXPENSE_TYPE,
          id_family: id_family,
          id_target: id_expenditure_type,
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
