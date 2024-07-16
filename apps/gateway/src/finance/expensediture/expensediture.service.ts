import { HttpException, Inject, Injectable } from '@nestjs/common';
import { FINANCE_SERVICE } from '../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { CreateExpenseDto } from './dto/createExpense.dto';
import { UpdateExpenseDto } from './dto/updateExpense.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NotificationType, RmqService } from '@app/common';

@Injectable()
export class ExpenseditureService {
  constructor(
    @Inject(FINANCE_SERVICE) private financeClient: ClientProxy,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
    private readonly rmqService: RmqService,
  ) {}

  async getExpenseByDate(id_user: string, id_family: number, date: Date) {
    try {
      return await this.rmqService.send(
        this.financeClient,
        'financeClient/getExpenseByDate',
        { id_user, id_family, date },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getExpenseByMonth(id_user: string, id_family, month, year) {
    try {
      return await this.rmqService.send(
        this.financeClient,
        'financeClient/getExpenseByMonth',
        { id_user, id_family, month, year },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }
  async getExpenseByYear(id_user: string, id_family, year) {
    try {
      return await this.rmqService.send(
        this.financeClient,
        'financeClient/getExpenseByYear',
        { id_user, id_family, year },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getExpenseditureById(
    id_user: string,
    id_family: number,
    id_expenditure: number,
  ) {
    try {
      return await this.rmqService.send(
        this.financeClient,
        'financeClient/getExpenseditureById',
        { id_user, id_family, id_expenditure },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getExpenseByDateRange(
    id_user: string,
    id_family: number,
    page: number,
    itemsPerPage: number,
    fromDate: Date | null,
    toDate: Date | null,
  ) {
    try {
      return await this.rmqService.send(
        this.financeClient,
        'financeClient/getExpenseByDateRange',
        { id_user, id_family, fromDate, toDate, page, itemsPerPage },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async createExpensediture(
    id_user: string,
    dto: CreateExpenseDto,
    file: Express.Multer.File,
  ) {
    try {
      const data = await this.rmqService.send(
        this.financeClient,
        'financeClient/createExpensediture',
        { id_user, dto, file },
      );
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'New Expenditure Created',
          content: 'New Expenditure has been created',
          type: NotificationType.EXPENSE,
          id_family: dto.id_family,
          id_target: data.id_expenditure_type,
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

  async updateExpensediture(
    id_user: string,
    dto: UpdateExpenseDto,
    file: Express.Multer.File,
  ) {
    try {
      const data = await this.rmqService.send(
        this.financeClient,
        'financeClient/updateExpensediture',
        { id_user, dto, file },
      );
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'Expenditure Updated',
          content: 'Expenditure has been updated',
          type: NotificationType.EXPENSE,
          id_family: dto.id_family,
          id_target: dto.id_expenditure,
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

  async deleteExpensediture(
    id_user: string,
    id_family: number,
    id_expenditure: number,
  ) {
    try {
      const data = await this.rmqService.send(
        this.financeClient,
        'financeClient/deleteExpensediture',
        { id_user, id_family, id_expenditure },
      );
      this.notificationsQueue.add('createNotificationFamily', {
        id_family,
        notificationData: {
          title: 'Expenditure deleted',
          content: 'Expenditure has been deleted',
          type: NotificationType.EXPENSE,
          id_family,
          id_target: id_expenditure,
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
