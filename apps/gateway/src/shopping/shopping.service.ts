import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SHOPPING_SERVICE } from '../utils';
import { ClientProxy } from '@nestjs/microservices';
import { TimeoutError, lastValueFrom, timeout } from 'rxjs';

@Injectable()
export class ShoppingService {
  constructor(
    @Inject(SHOPPING_SERVICE) private readonly shoppingClient: ClientProxy,
  ) {}

  async getShoppingItemType() {
    try {
      const response = this.shoppingClient
        .send('shoppingClient/getShoppingItemType', {})
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
    page: number,
    itemsPerPage: number,
  ) {
    try {
      const response = this.shoppingClient
        .send('shoppingClient/getShoppingItem', {
          id_user,
          id_list,
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
      return await lastValueFrom(response);
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async createShoppingItem(id_user: string, dto: any) {
    try {
      const response = this.shoppingClient
        .send('shoppingClient/createShoppingItem', { id_user, dto })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
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
      return await lastValueFrom(response);
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async updateShoppingItem(id_user: string, dto: any) {
    try {
      const response = this.shoppingClient
        .send('shoppingClient/updateShoppingItem', { id_user, dto })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
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
      return await lastValueFrom(response);
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
      return await lastValueFrom(response);
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}
