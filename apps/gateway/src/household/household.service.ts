import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { HOUSEHOLD_SERVICE } from '../utils';
import { ClientProxy } from '@nestjs/microservices';
import { TimeoutError, lastValueFrom, timeout } from 'rxjs';
import { InputDurableItemDto } from './dto/inputDurableItem.dto';
import { InputConsumableItemDto } from './dto/inputConsumableItem.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NotificationType } from '@app/common';

@Injectable()
export class HouseholdService {
  constructor(
    @Inject(HOUSEHOLD_SERVICE) private householdClient: ClientProxy,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
  ) {}

  async getCategory() {
    try {
      const response = this.householdClient
        .send('householdClient/getCategory', {})
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getItem(
    id_user: string,
    id_family: number,
    page: number,
    itemsPerPage: number,
  ) {
    try {
      const response = this.householdClient
        .send('householdClient/getItem', {
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

  async getItemDetail(id_user: string, id_family: number, id_item: number) {
    try {
      const response = this.householdClient
        .send('householdClient/getItemDetail', { id_user, id_family, id_item })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async createItem(id_user: string, dto: any, file: Express.Multer.File) {
    try {
      const response = this.householdClient
        .send('householdClient/createItem', { id_user, dto, file })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
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
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async updateItem(id_user: string, dto: any, file: Express.Multer.File) {
    try {
      const response = this.householdClient
        .send('householdClient/updateItem', { id_user, dto, file })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
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
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async inputDurableItem(id_user: string, dto: InputDurableItemDto) {
    try {
      const response = this.householdClient
        .send('householdClient/inputDurableItem', { id_user, dto })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
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
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async inputConsumableItem(id_user: string, dto: InputConsumableItemDto) {
    try {
      const response = this.householdClient
        .send('householdClient/inputConsumableItem', { id_user, dto })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
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
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async deleteItem(id_user: string, id_family: number, id_item: number) {
    try {
      const response = this.householdClient
        .send('householdClient/deleteItem', { id_user, id_family, id_item })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
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
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getLowConditionItem(id_user: string, id_family: number) {
    try {
      const response = this.householdClient
        .send('householdClient/getLowConditionItem', { id_user, id_family })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}
