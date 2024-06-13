import { HttpException, Inject, Injectable } from '@nestjs/common';
import { FINANCE_SERVICE } from '../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { CreateExpenseDto } from './dto/createExpense.dto';

@Injectable()
export class ExpenseditureService {
  constructor(@Inject(FINANCE_SERVICE) private financeClient: ClientProxy) {}

  async getExpenseByDate(id_user: string, id_family, date: any) {
    try {
      const response = this.financeClient
        .send('financeClient/getExpenseByDate', { id_user, id_family, date })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getExpenseByMonth(id_user: string, id_family, month, year) {
    try {
      const response = this.financeClient
        .send('financeClient/getExpenseByMonth', {
          id_user,
          id_family,
          month,
          year,
        })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
  async getExpenseByYear(id_user: string, id_family, year) {
    try {
      const response = this.financeClient
        .send('financeClient/getExpenseByYear', { id_user, id_family, year })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getExpenseditureById(
    id_user: string,
    id_family: number,
    id_expenditure: number,
  ) {
    try {
      const response = this.financeClient
        .send('financeClient/getExpenseditureById', {
          id_user,
          id_family,
          id_expenditure,
        })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getStatiscalExpensediture(id_user: string, id_family: number) {
    try {
      const response = this.financeClient
        .send('financeClient/getStatiscalExpensediture', { id_user, id_family })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async createExpensediture(id_user: string, dto: CreateExpenseDto) {
    try {
      const response = this.financeClient
        .send('financeClient/createExpensediture', { id_user, dto })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async updateExpensediture(id_user: string, dto: any) {
    try {
      const response = this.financeClient
        .send('financeClient/updateExpensediture', { id_user, dto })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async deleteExpensediture(
    id_user: string,
    id_family: number,
    id_expenditure: number,
  ) {
    try {
      const response = this.financeClient
        .send('financeClient/deleteExpensediture', {
          id_user,
          id_family,
          id_expenditure,
        })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async uploadImageExpense(
    id_user: string,
    id_family: number,
    id_expenditure: number,
    file: any,
  ) {
    try {
      const response = this.financeClient
        .send('financeClient/uploadImageExpense', {
          id_user,
          id_family,
          id_expenditure,
          file,
        })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}
