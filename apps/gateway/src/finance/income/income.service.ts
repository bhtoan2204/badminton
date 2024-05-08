import { HttpException, Inject, Injectable } from "@nestjs/common";
import { FINANCE_SERVICE } from "../../utils";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom, timeout } from "rxjs";

@Injectable()
export class IncomeService {
  constructor(
    @Inject(FINANCE_SERVICE) private financeClient: ClientProxy
  ) {}

  async getIncome(id_user: string, id_family: number, page: number, itemsPerPage: number) {
    try {
      const response = this.financeClient.send('financeClient/getIncome', {id_user, id_family, page, itemsPerPage})
        .pipe(
          timeout(5000),
        );
      const data = await lastValueFrom(response);
      return data;
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getIncomeById(id_user: string, id_family: number, id_income: number) {
    try {
      const response = this.financeClient.send('financeClient/getIncomeById', {id_user, id_family, id_income})
        .pipe(
          timeout(5000),
        );
      const data = await lastValueFrom(response);
      return data;
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getStasticalIncome(id_user: string, id_family: number) {
    try {
      const response = this.financeClient.send('financeClient/getStatiscalIncome', {id_user, id_family})
        .pipe(
          timeout(5000),
        );
      const data = await lastValueFrom(response);
      return data;
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async createIncome(id_user: string, dto: any) {
    try {
      const response = this.financeClient.send('financeClient/createIncome', {id_user, dto})
        .pipe(
          timeout(5000),
        );
      const data = await lastValueFrom(response);
      return data;
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async updateIncome(id_user: string, dto) {
    try {
      const response = this.financeClient.send('financeClient/updateIncome', {id_user, dto})
        .pipe(
          timeout(5000),
        );
      const data = await lastValueFrom(response);
      return data;
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async deleteIncome(id_user: string, id_family: number, id_income: number) {
    try {
      const response = this.financeClient.send('financeClient/deleteIncome', {id_user, id_family, id_income})
        .pipe(
          timeout(5000),
        );
      const data = await lastValueFrom(response);
      return data;
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
  
}