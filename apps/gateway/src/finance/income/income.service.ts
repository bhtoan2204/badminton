import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FINANCE_SERVICE } from '../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { TimeoutError, lastValueFrom, timeout } from 'rxjs';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NotificationType } from '@app/common';
import { UpdateIncomeDto } from './dto/updateIncome.dto';

@Injectable()
export class IncomeService {
  constructor(
    @Inject(FINANCE_SERVICE) private financeClient: ClientProxy,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
  ) {}

  async getIncomeByDate(id_user: string, id_family: number, date: string) {
    try {
      const response = this.financeClient
        .send('financeClient/getIncomeByDate', { id_user, id_family, date })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getIncomeByMonth(
    id_user: string,
    id_family: number,
    month: number,
    year: number,
  ) {
    try {
      const response = this.financeClient
        .send('financeClient/getIncomeByMonth', {
          id_user,
          id_family,
          month,
          year,
        })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getIncomeByYear(id_user: string, id_family: number, year: number) {
    try {
      const response = this.financeClient
        .send('financeClient/getIncomeByYear', { id_user, id_family, year })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getIncomeById(id_user: string, id_family: number, id_income: number) {
    try {
      const response = this.financeClient
        .send('financeClient/getIncomeById', { id_user, id_family, id_income })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getIncomeByDateRange(
    id_user: string,
    id_family: number,
    page: number,
    itemsPerPage: number,
    fromDate: Date,
    toDate: Date,
  ) {
    try {
      const response = this.financeClient
        .send('financeClient/getIncomeByDateRange', {
          id_user,
          id_family,
          page,
          itemsPerPage,
          fromDate,
          toDate,
        })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async createIncome(id_user: string, dto: any) {
    try {
      const response = this.financeClient
        .send('financeClient/createIncome', { id_user, dto })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'New Income created',
          content: 'New Income has been created',
          type: NotificationType.INCOME,
          id_family: dto.id_family,
          id_target: data.id_income,
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

  async updateIncome(id_user: string, dto: UpdateIncomeDto) {
    try {
      const response = this.financeClient
        .send('financeClient/updateIncome', { id_user, dto })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'Income updated',
          content: 'Income has been updated',
          type: NotificationType.INCOME,
          id_family: dto.id_family,
          id_target: dto.id_income,
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

  async deleteIncome(id_user: string, id_family: number, id_income: number) {
    try {
      const response = this.financeClient
        .send('financeClient/deleteIncome', { id_user, id_family, id_income })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      this.notificationsQueue.add('createNotificationFamily', {
        id_family,
        notificationData: {
          title: 'Income deleted',
          content: 'Income has been deleted',
          type: NotificationType.INCOME,
          id_family,
          id_target: id_income,
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
