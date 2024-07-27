import { HttpException, Inject, Injectable } from '@nestjs/common';
import { FINANCE_SERVICE } from '../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NotificationType, RmqService } from '@app/common';
import { UpdateIncomeDto } from './dto/updateIncome.dto';
import { GetIncomeDto } from './dto/getIncome.dto';

@Injectable()
export class IncomeService {
  constructor(
    @Inject(FINANCE_SERVICE) private financeClient: ClientProxy,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
    private readonly rmqService: RmqService,
  ) {}

  async getIncomeByDate(id_user: string, id_family: number, date: string) {
    try {
      return await this.rmqService.send(
        this.financeClient,
        'financeClient/getIncomeByDate',
        { id_user, id_family, date },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getIncomeByMonth(
    id_user: string,
    id_family: number,
    month: number,
    year: number,
  ) {
    try {
      return await this.rmqService.send(
        this.financeClient,
        'financeClient/getIncomeByMonth',
        { id_user, id_family, month, year },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getIncomeByYear(id_user: string, id_family: number, year: number) {
    try {
      return await this.rmqService.send(
        this.financeClient,
        'financeClient/getIncomeByYear',
        { id_user, id_family, year },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getIncomeById(id_user: string, id_family: number, id_income: number) {
    try {
      return await this.rmqService.send(
        this.financeClient,
        'financeClient/getIncomeById',
        { id_user, id_family, id_income },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getIncomeByDateRange(id_user: string, dto: GetIncomeDto) {
    try {
      return await this.rmqService.send(
        this.financeClient,
        'financeClient/getIncomeByDateRange',
        { id_user, dto },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async createIncome(id_user: string, dto: any) {
    try {
      const data = await this.rmqService.send(
        this.financeClient,
        'financeClient/createIncome',
        { id_user, dto },
      );
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'New Income created',
          title_vn: 'Thu nhập mới được tạo',
          content: 'New Income has been created',
          content_vn: 'Thu nhập mới đã được tạo',
          type: NotificationType.INCOME,
          id_family: dto.id_family,
          id_target: data.id_income,
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

  async updateIncome(id_user: string, dto: UpdateIncomeDto) {
    try {
      const data = await this.rmqService.send(
        this.financeClient,
        'financeClient/updateIncome',
        { id_user, dto },
      );
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'Income updated',
          title_vn: 'Thu nhập đã được cập nhật',
          content: 'Income has been updated',
          content_vn: 'Thu nhập đã được cập nhật',
          type: NotificationType.INCOME,
          id_family: dto.id_family,
          id_target: dto.id_income,
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

  async deleteIncome(id_user: string, id_family: number, id_income: number) {
    try {
      const data = await this.rmqService.send(
        this.financeClient,
        'financeClient/deleteIncome',
        { id_user, id_family, id_income },
      );
      this.notificationsQueue.add('createNotificationFamily', {
        id_family,
        notificationData: {
          title: 'Income deleted',
          title_vn: 'Thu nhập đã bị xóa',
          content: 'Income has been deleted',
          content_vn: 'Thu nhập đã bị xóa',
          type: NotificationType.INCOME,
          id_family,
          id_target: id_income,
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
