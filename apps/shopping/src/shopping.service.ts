import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { EntityManager } from 'typeorm';

@Injectable()
export class ShoppingService {
  constructor(
    private readonly entityManager: EntityManager,
  ) { }

  async getShoppingItemType() {
    try {
      const query = 'SELECT * FROM shopping_item_types';
      const data = await this.entityManager.query(query);
      return {
        data: data,
        message: 'Get shopping item type',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getShoppingList(id_user: string, id_family: number, page: number, itemsPerPage: number) {
    try {
      const query = 'SELECT * FROM f_get_shopping_list($1, $2, $3, $4)';
      const params = [id_user, id_family, page, itemsPerPage];
      const data = await this.entityManager.query(query, params);
      return {
        data: data,
        message: 'Get shopping list',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getShoppingItem(id_user: string, id_list: number, page: number, itemsPerPage: number) {
    try {
      const query = 'SELECT * FROM f_get_shopping_item($1, $2, $3, $4)';
      const params = [id_user, id_list, page, itemsPerPage];
      const data = await this.entityManager.query(query, params);
      return {
        data: data,
        message: 'Get shopping item',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async createShoppingList(id_user: string, dto: any) {
    try {
      const { id_family, title, description } = dto;
      const query = 'SELECT * FROM f_create_shopping_list($1, $2, $3, $4)';
      const params = [id_user, id_family, title, description];
      const data = await this.entityManager.query(query, params);
      return {
        data: data,
        message: 'Create shopping list',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async createShoppingItem(id_user: string, dto: any) {
    try {
      const { id_list, item_name, quantity, id_item_type, priority_level, reminder_date, price, description } = dto;
      const query = 'SELECT * FROM f_create_shopping_item($1, $2, $3, $4, $5, $6, $7, $8, $9)';
      const params = [id_user, id_list, item_name, quantity, id_item_type, priority_level, reminder_date, price, description];
      const data = await this.entityManager.query(query, params);
      return {
        data: data,
        message: 'Create shopping item',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }
}
