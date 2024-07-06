import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FINANCE_SERVICE } from '../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { TimeoutError, lastValueFrom, timeout } from 'rxjs';
import { CreateExpenseDto } from './dto/createExpense.dto';
import { UpdateExpenseDto } from './dto/updateExpense.dto';

@Injectable()
export class ExpenseditureService {
  constructor(@Inject(FINANCE_SERVICE) private financeClient: ClientProxy) {}

  async getExpenseByDate(id_user: string, id_family: number, date: Date) {
    try {
      const response = this.financeClient
        .send('financeClient/getExpenseByDate', { id_user, id_family, date })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
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
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
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
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
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
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getExpenseByDateRange(
    id_user: string,
    id_family: number,
    page: number,
    itemsPerPage: number,
    fromDate: Date | null,
    toDate: Date | null,
  ) {
    try {
      const response = this.financeClient
        .send('financeClient/getExpenseByDateRange', {
          id_user,
          id_family,
          fromDate,
          toDate,
          page,
          itemsPerPage,
        })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async createExpensediture(
    id_user: string,
    dto: CreateExpenseDto,
    file: Express.Multer.File,
  ) {
    try {
      const response = this.financeClient
        .send('financeClient/createExpensediture', { id_user, dto, file })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async updateExpensediture(
    id_user: string,
    dto: UpdateExpenseDto,
    file: Express.Multer.File,
  ) {
    console.log(dto);
    try {
      const response = this.financeClient
        .send('financeClient/updateExpensediture', { id_user, dto, file })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
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
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}
