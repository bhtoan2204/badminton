import { HttpException, Inject, Injectable } from '@nestjs/common';
import { FINANCE_SERVICE } from '../../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { CreateExpenseditureTypeDto } from './dto/createExpenseditureType.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NotificationType, RmqService } from '@app/common';
import { UpdateExpenseditureTypeDto } from './dto/updateExpenseditureType.dto';

@Injectable()
export class ExpenseditureTypeService {
  constructor(
    @Inject(FINANCE_SERVICE) private financeClient: ClientProxy,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
    private readonly rmqService: RmqService,
  ) {}

  async getExpenseditureType(
    id_user: string,
    id_family: number,
    page: number,
    itemsPerPage: number,
  ) {
    try {
      return await this.rmqService.send(
        this.financeClient,
        'financeClient/getExpenseditureType',
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

  async createExpenseditureType(
    id_user: string,
    dto: CreateExpenseditureTypeDto,
  ) {
    try {
      const data = await this.rmqService.send(
        this.financeClient,
        'financeClient/createExpenseditureType',
        { id_user, dto },
      );
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'New Expenditure Type',
          title_vn: 'Loại chi tiêu mới',
          content: 'New Expenditure Type has been created',
          content_vn: 'Loại chi tiêu mới đã được tạo',
          type: NotificationType.EXPENSE_TYPE,
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

  async updateExpenseditureType(
    id_user: string,
    dto: UpdateExpenseditureTypeDto,
  ) {
    try {
      const data = await this.rmqService.send(
        this.financeClient,
        'financeClient/updateExpenseditureType',
        { id_user, dto },
      );
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'Expenditure Type updated',
          title_vn: 'Loại chi tiêu đã được cập nhật',
          content: 'Expenditure Type has been updated',
          content_vn: 'Loại chi tiêu đã được cập nhật',
          type: NotificationType.EXPENSE_TYPE,
          id_family: dto.id_family,
          id_target: dto.id_expenditure_type,
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

  async deleteExpenseditureType(
    id_user: string,
    id_family: number,
    id_expenditure_type: number,
  ) {
    try {
      const data = await this.rmqService.send(
        this.financeClient,
        'financeClient/deleteExpenseditureType',
        { id_user, id_family, id_expenditure_type },
      );
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: id_family,
        notificationData: {
          title: 'Expenditure Type deleted',
          title_vn: 'Loại chi tiêu đã bị xóa',
          content: 'Expenditure Type has been deleted',
          content_vn: 'Loại chi tiêu đã bị xóa',
          type: NotificationType.EXPENSE_TYPE,
          id_family: id_family,
          id_target: id_expenditure_type,
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
