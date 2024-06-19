import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { HOUSEHOLD_SERVICE } from '../utils';
import { ClientProxy } from '@nestjs/microservices';
import { TimeoutError, lastValueFrom, timeout } from 'rxjs';
import { InputDurableItemDto } from './dto/inputDurableItem.dto';
import { InputConsumableItemDto } from './dto/inputConsumableItem.dto';

@Injectable()
export class HouseholdService {
  constructor(
    @Inject(HOUSEHOLD_SERVICE) private householdClient: ClientProxy,
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
      return await lastValueFrom(response);
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
      return await lastValueFrom(response);
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
      return await lastValueFrom(response);
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
      return await lastValueFrom(response);
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
      return await lastValueFrom(response);
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
