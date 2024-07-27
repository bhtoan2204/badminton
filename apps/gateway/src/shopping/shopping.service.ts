import { HttpException, Inject, Injectable } from '@nestjs/common';
import { SHOPPING_SERVICE } from '../utils';
import { ClientProxy } from '@nestjs/microservices';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NotificationType, RmqService } from '@app/common';
import { CreateShoppingItemDto } from './dto/createShoppingItem.dto';
import { UpdateShoppingItemDto } from './dto/updateShoppingItem.dto';
import { GetShoppingListDto } from './dto/getShoppingList.dto';

@Injectable()
export class ShoppingService {
  constructor(
    @Inject(SHOPPING_SERVICE) private readonly shoppingClient: ClientProxy,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
    private readonly rmqService: RmqService,
  ) {}

  async getShoppingItemType(search: string) {
    try {
      return await this.rmqService.send(
        this.shoppingClient,
        'shoppingClient/getShoppingItemType',
        { search },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getShoppingList(id_user: string, dto: GetShoppingListDto) {
    try {
      return await this.rmqService.send(
        this.shoppingClient,
        'shoppingClient/getShoppingList',
        {
          id_user,
          dto,
        },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getShoppingItem(id_user: string, dto) {
    try {
      return await this.rmqService.send(
        this.shoppingClient,
        'shoppingClient/getShoppingItem',
        {
          id_user,
          dto,
        },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async createShoppingList(id_user: string, dto: any) {
    try {
      const data = await this.rmqService.send(
        this.shoppingClient,
        'shoppingClient/createShoppingList',
        { id_user, dto },
      );
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'New Shopping List',
          title_vn: 'Danh sách mua sắm mới',
          content: 'New Shopping List has been created',
          content_vn: 'Danh sách mua sắm mới đã được tạo',
          type: NotificationType.SHOPPING_LIST,
          id_family: dto.id_family,
          id_target: data.data.id_list,
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

  async getShoppingListType(search: string) {
    try {
      return await this.rmqService.send(
        this.shoppingClient,
        'shoppingClient/getShoppingListType',
        { search },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async createShoppingItem(id_user: string, dto: CreateShoppingItemDto) {
    try {
      const data = await this.rmqService.send(
        this.shoppingClient,
        'shoppingClient/createShoppingItem',
        { id_user, dto },
      );
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'New Shopping Item',
          title_vn: 'Mặt hàng mua sắm mới',
          content: 'New Shopping Item has been created',
          content_vn: 'Mặt hàng mua sắm mới đã được tạo',
          type: NotificationType.SHOPPING_ITEM,
          id_family: dto.id_family,
          id_target: data.data.id_item,
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

  async updateShoppingList(id_user: string, dto: any) {
    try {
      const data = await this.rmqService.send(
        this.shoppingClient,
        'shoppingClient/updateShoppingList',
        { id_user, dto },
      );
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'Shopping List Updated',
          title_vn: 'Danh sách mua sắm đã được cập nhật',
          content: 'Shopping List has been updated',
          content_vn: 'Danh sách mua sắm đã được cập nhật',
          type: NotificationType.SHOPPING_LIST,
          id_family: dto.id_family,
          id_target: dto.id_list,
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

  async updateShoppingItem(id_user: string, dto: UpdateShoppingItemDto) {
    try {
      const data = await this.rmqService.send(
        this.shoppingClient,
        'shoppingClient/updateShoppingItem',
        { id_user, dto },
      );
      this.notificationsQueue.add('createNotificationFamily', {
        id_family: dto.id_family,
        notificationData: {
          title: 'Shopping Item Updated',
          title_vn: 'Mặt hàng mua sắm đã được cập nhật',
          content: 'Shopping Item has been updated',
          content_vn: 'Mặt hàng mua sắm đã được cập nhật',
          type: NotificationType.SHOPPING_ITEM,
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

  async deleteShoppingList(
    id_user: string,
    id_family: number,
    id_list: number,
  ) {
    try {
      const data = await this.rmqService.send(
        this.shoppingClient,
        'shoppingClient/deleteShoppingList',
        {
          id_user,
          id_family,
          id_list,
        },
      );
      this.notificationsQueue.add('createNotificationFamily', {
        id_family,
        notificationData: {
          title: 'Shopping List Deleted',
          title_vn: 'Danh sách mua sắm đã bị xóa',
          content: 'Shopping List has been deleted',
          content_vn: 'Danh sách mua sắm đã bị xóa',
          type: NotificationType.SHOPPING_LIST,
          id_family,
          id_target: id_list,
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

  async deleteShoppingItem(
    id_user: number,
    id_family: number,
    id_list: number,
    id_item: number,
  ) {
    try {
      const data = await this.rmqService.send(
        this.shoppingClient,
        'shoppingClient/deleteShoppingItem',
        {
          id_user,
          id_list,
          id_item,
          id_family,
        },
      );
      this.notificationsQueue.add('createNotificationFamily', {
        id_family,
        notificationData: {
          title: 'Shopping Item Deleted',
          title_vn: 'Mặt hàng mua sắm đã bị xóa',
          content: 'Shopping Item has been deleted',
          content_vn: 'Mặt hàng mua sắm đã bị xóa',
          type: NotificationType.SHOPPING_ITEM,
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

  async getSuggestions(
    id_user: string,
    id_family: number,
    id_list: number,
    id_item: number,
  ) {
    try {
      return await this.rmqService.send(
        this.shoppingClient,
        'shoppingClient/getSuggestions',
        {
          id_user,
          id_family,
          id_list,
          id_item,
        },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }
}
