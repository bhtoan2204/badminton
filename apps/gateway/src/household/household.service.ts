import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { HOUSEHOLD_SERVICE } from "../utils";
import { ClientProxy } from "@nestjs/microservices";
import { TimeoutError, lastValueFrom, timeout } from "rxjs";

@Injectable()
export class HouseholdService {
  constructor(
    @Inject(HOUSEHOLD_SERVICE) private householdClient: ClientProxy
  ) { }

  async getCategory() {
    try {
      const response = this.householdClient.send('householdClient/getCategory', { })
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

  async getItem(id_user: string, id_family: number, page: number, itemsPerPage: number) {
    try {
      const response = this.householdClient.send('householdClient/getItem', { id_user, id_family, page, itemsPerPage })
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

  async getItemDetail(id_user: string, id_family: number, id_item: number) {
    try {
      const response = this.householdClient.send('householdClient/getItemDetail', { id_user, id_family, id_item })
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

  async createItem(id_user: string, dto: any, file: Express.Multer.File) {
    try {
      const response = this.householdClient.send('householdClient/createItem', { id_user, dto, file })
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

  async deleteItem(id_user: string, id_family: number, id_item: number) {
    try {
      const response = this.householdClient.send('householdClient/deleteItem', { id_user, id_family, id_item })
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