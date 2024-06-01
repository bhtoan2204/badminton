import { HttpException, Inject, Injectable } from "@nestjs/common";
import { FINANCE_SERVICE } from "../../../utils";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom, timeout } from "rxjs";

@Injectable()
export class ExpenseditureTypeService {
  constructor(
    @Inject(FINANCE_SERVICE) private financeClient: ClientProxy
  ) { }

  async getExpenseditureType(id_user: string, id_family: number) {
    try {
      const response = this.financeClient.send('financeClient/getExpenseditureType', { id_user, id_family })
        .pipe(
          timeout(15000),
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

  async createExpenseditureType(id_user: string, dto: any) {
    try {
      const response = this.financeClient.send('financeClient/createExpenseditureType', { id_user, dto })
        .pipe(
          timeout(15000),
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

  async updateExpenseditureType(id_user: string, dto: any) {
    try {
      const response = this.financeClient.send('financeClient/updateExpenseditureType', { id_user, dto })
        .pipe(
          timeout(15000),
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

  async deleteExpenseditureType(id_user: string, id_family: number, id_expenditure_type: number) {
    try {
      const response = this.financeClient.send('financeClient/deleteExpenseditureType', { id_user, id_family, id_expenditure_type })
        .pipe(
          timeout(15000),
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