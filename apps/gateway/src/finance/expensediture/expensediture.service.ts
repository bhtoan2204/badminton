import { HttpException, Inject, Injectable } from "@nestjs/common";
import { FINANCE_SERVICE } from "../../utils";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom, timeout } from "rxjs";
import { CreateExpenseDto } from "./dto/createExpense.dto";

@Injectable()
export class ExpenseditureService {
  constructor(
    @Inject(FINANCE_SERVICE) private financeClient: ClientProxy
  ) { }

  async getExpenseditureType() {
    try {
      const response = this.financeClient.send('financeClient/getExpenseditureType', {})
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

  async getExpensediture(id_user: string, id_family: number, page: number, itemsPerPage: number) {
    try {
      const response = this.financeClient.send('financeClient/getExpensediture', { id_user, id_family, page, itemsPerPage })
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

  async getExpenseditureById(id_user: string, id_family: number, id_expenditure: number) {
    try {
      const response = this.financeClient.send('financeClient/getExpenseditureById', { id_user, id_family, id_expenditure })
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

  async getStatiscalExpensediture(id_user: string, id_family: number) {
    try {
      const response = this.financeClient.send('financeClient/getStatiscalExpensediture', { id_user, id_family })
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

  async createExpensediture(id_user: string, dto: CreateExpenseDto) {
    try {
      const response = this.financeClient.send('financeClient/createExpensediture', { id_user, dto })
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

  async updateExpensediture(id_user: string, dto: any) {
    try {
      const response = this.financeClient.send('financeClient/updateExpensediture', { id_user, dto })
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

  async deleteExpensediture(id_user: string, id_family: number, id_expenditure: number) {
    try {
      const response = this.financeClient.send('financeClient/deleteExpensediture', { id_user, id_family, id_expenditure })
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