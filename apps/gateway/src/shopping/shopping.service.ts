import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { SHOPPING_SERVICE } from "../utils";
import { ClientProxy } from "@nestjs/microservices";
import { TimeoutError, lastValueFrom, timeout } from "rxjs";

@Injectable()
export class ShoppingService {
  constructor(
    @Inject(SHOPPING_SERVICE) private readonly shoppingClient: ClientProxy
  ) {}

  async getShoppingItemType() {
    try {
      const response = this.shoppingClient.send('shoppingClient/getShoppingItemType', {})
      .pipe(
        timeout(5000),
      );
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
  
  async getShoppingList(id_user: string, id_family: number, page: number, itemsPerPage: number) {
    try {
      const response = this.shoppingClient.send('shoppingClient/getShoppingList', { id_user, id_family, page, itemsPerPage})
      .pipe(
        timeout(5000),
      );
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getShoppingItem(id_user: string, id_list: number, page: number, itemsPerPage: number) {
    try {
      const response = this.shoppingClient.send('shoppingClient/getShoppingItem', { id_user, id_list, page, itemsPerPage })
      .pipe(
        timeout(5000),
      );
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async createShoppingList(id_user: string, dto: any) {
    try {
      const response = this.shoppingClient.send('shoppingClient/createShoppingList', { id_user, dto })
      .pipe(
        timeout(5000),
      );
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async createShoppingItem(id_user: string, dto: any) {
    try {
      const response = this.shoppingClient.send('shoppingClient/createShoppingItem', { id_user, dto })
      .pipe(
        timeout(5000),
      );
      return await lastValueFrom(response);
    }
    catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}