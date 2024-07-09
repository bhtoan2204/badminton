import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SHOPPING_SERVICE } from '../utils';
import { ClientProxy } from '@nestjs/microservices';
import { TimeoutError, lastValueFrom, timeout } from 'rxjs';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NotificationType } from '@app/common';
import { CreateShoppingItemDto } from './dto/createShoppingItem.dto';
import { UpdateShoppingItemDto } from './dto/updateShoppingItem.dto';

@Injectable()
export class ShoppingService {
  constructor(
    @Inject(SHOPPING_SERVICE) private readonly shoppingClient: ClientProxy,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
  ) {}

  async getShoppingItemType(search: string) {
    try {
      const response = this.shoppingClient
        .send('shoppingClient/getShoppingItemType', { search })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getShoppingList(
    id_user: string,
    id_family: number,
    page: number,
    itemsPerPage: number,
  ) {
    try {
      const response = this.shoppingClient
        .send('shoppingClient/getShoppingList', {
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

  async getShoppingItem(
    id_user: string,
    id_list: number,
    id_family: number,
    page: number,
    itemsPerPage: number,
  ) {
    try {
      const response = this.shoppingClient
        .send('shoppingClient/getShoppingItem', {
          id_user,
          id_list,
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

  async createShoppingList(id_user: string, dto: any) {
    try {
      const response = this.shoppingClient
        .send('shoppingClient/createShoppingList', { id_user, dto })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'New Shopping List',
          content: 'New Shopping List has been created',
          type: NotificationType.SHOPPING_LIST,
          id_family: dto.id_family,
          id_target: data.data.id_list,
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

  async getShoppingListType(search: string) {
    try {
      const response = this.shoppingClient
        .send('shoppingClient/getShoppingListType', { search })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async createShoppingItem(id_user: string, dto: CreateShoppingItemDto) {
    try {
      const response = this.shoppingClient
        .send('shoppingClient/createShoppingItem', { id_user, dto })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'New Shopping Item',
          content: 'New Shopping Item has been created',
          type: NotificationType.SHOPPING_ITEM,
          id_family: dto.id_family,
          id_target: data.data.id_item,
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

  async updateShoppingList(id_user: string, dto: any) {
    try {
      const response = this.shoppingClient
        .send('shoppingClient/updateShoppingList', { id_user, dto })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'Shopping List Updated',
          content: 'Shopping List has been updated',
          type: NotificationType.SHOPPING_LIST,
          id_family: dto.id_family,
          id_target: dto.id_list,
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

  async updateShoppingItem(id_user: string, dto: UpdateShoppingItemDto) {
    try {
      const response = this.shoppingClient
        .send('shoppingClient/updateShoppingItem', { id_user, dto })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'Shopping Item Updated',
          content: 'Shopping Item has been updated',
          type: NotificationType.SHOPPING_ITEM,
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

  async deleteShoppingList(
    id_user: string,
    id_family: number,
    id_list: number,
  ) {
    try {
      const response = this.shoppingClient
        .send('shoppingClient/deleteShoppingList', {
          id_user,
          id_family,
          id_list,
        })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      this.notificationsQueue.add('createNotificationFamily', {
        id_family,
        notificationData: {
          title: 'Shopping List Deleted',
          content: 'Shopping List has been deleted',
          type: NotificationType.SHOPPING_LIST,
          id_family,
          id_target: id_list,
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

  async deleteShoppingItem(
    id_user: number,
    id_family: number,
    id_list: number,
    id_item: number,
  ) {
    try {
      const response = this.shoppingClient
        .send('shoppingClient/deleteShoppingItem', {
          id_user,
          id_list,
          id_item,
          id_family,
        })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      this.notificationsQueue.add('createNotificationFamily', {
        id_family,
        notificationData: {
          title: 'Shopping Item Deleted',
          content: 'Shopping Item has been deleted',
          type: NotificationType.SHOPPING_ITEM,
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

  async getSuggestions(
    id_user: string,
    id_family: number,
    id_list: number,
    id_item: number,
  ) {
    try {
      const response = this.shoppingClient
        .send('shoppingClient/getSuggestions', {
          id_user,
          id_family,
          id_list,
          id_item,
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
}
