import { HttpException, Inject, Injectable } from '@nestjs/common';
import { HOUSEHOLD_SERVICE } from '../utils';
import { ClientProxy } from '@nestjs/microservices';
import { InputDurableItemDto } from './dto/inputDurableItem.dto';
import { InputConsumableItemDto } from './dto/inputConsumableItem.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NotificationType, RmqService } from '@app/common';

@Injectable()
export class HouseholdService {
  constructor(
    @Inject(HOUSEHOLD_SERVICE) private householdClient: ClientProxy,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
    private readonly rmqService: RmqService,
  ) {}

  async getCategory() {
    try {
      return await this.rmqService.send(
        this.householdClient,
        'householdClient/getCategory',
        {},
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getItem(
    id_user: string,
    id_family: number,
    page: number,
    itemsPerPage: number,
  ) {
    try {
      return await this.rmqService.send(
        this.householdClient,
        'householdClient/getItem',
        { id_user, id_family, page, itemsPerPage },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getItemDetail(id_user: string, id_family: number, id_item: number) {
    try {
      return await this.rmqService.send(
        this.householdClient,
        'householdClient/getItemDetail',
        { id_user, id_family, id_item },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async createItem(id_user: string, dto: any, file: Express.Multer.File) {
    try {
      const data = await this.rmqService.send(
        this.householdClient,
        'householdClient/createItem',
        { id_user, dto, file },
      );

      await this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'New Household Item Created',
          content: 'New Household Item has been created',
          type: NotificationType.HOUSEHOLD,
          id_family: dto.id_family,
          id_target: data.data.id_household_item,
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

  async updateItem(id_user: string, dto: any, file: Express.Multer.File) {
    try {
      const data = await this.rmqService.send(
        this.householdClient,
        'householdClient/updateItem',
        { id_user, dto, file },
      );

      await this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'Household Item Updated',
          content: 'Household Item has been updated',
          type: NotificationType.HOUSEHOLD,
          id_family: dto.id_family,
          id_target: dto.id_item,
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

  async inputDurableItem(id_user: string, dto: InputDurableItemDto) {
    try {
      const data = await this.rmqService.send(
        this.householdClient,
        'householdClient/inputDurableItem',
        { id_user, dto },
      );

      await this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'New Durable Item Changed',
          content: 'New Durable Item has been inputted',
          type: NotificationType.HOUSEHOLD,
          id_family: dto.id_family,
          id_target: data.data.id_household_item,
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

  async inputConsumableItem(id_user: string, dto: InputConsumableItemDto) {
    try {
      const data = await this.rmqService.send(
        this.householdClient,
        'householdClient/inputConsumableItem',
        { id_user, dto },
      );

      await this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'New Consumable Item Changed',
          content: 'New Consumable Item has been inputted',
          type: NotificationType.HOUSEHOLD,
          id_family: dto.id_family,
          id_target: data.data.id_household_item,
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

  async deleteItem(id_user: string, id_family: number, id_item: number) {
    try {
      const data = await this.rmqService.send(
        this.householdClient,
        'householdClient/deleteItem',
        { id_user, id_family, id_item },
      );

      await this.notificationsQueue.add('createNotificationFamily', {
        id_family,
        notificationData: {
          title: 'Household Item Deleted',
          content: 'Household Item has been deleted',
          type: NotificationType.HOUSEHOLD,
          id_family,
          id_target: id_item,
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

  async getLowConditionItem(id_user: string, id_family: number) {
    try {
      return await this.rmqService.send(
        this.householdClient,
        'householdClient/getLowConditionItem',
        { id_user, id_family },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }
}
