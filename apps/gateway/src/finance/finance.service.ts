import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FINANCE_SERVICE } from '../utils';
import { ClientProxy } from '@nestjs/microservices';
import { TimeoutError, lastValueFrom, timeout } from 'rxjs';

@Injectable()
export class FinanceService {
  constructor(@Inject(FINANCE_SERVICE) private financeClient: ClientProxy) {}

  async getFinanceSummary(id_user: string, id_family: number) {
    try {
      const response = this.financeClient
        .send('financeClient/getFinanceSummary', { id_user, id_family })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new HttpException('Timeout', HttpStatus.REQUEST_TIMEOUT);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async processInvoice(file: Express.Multer.File) {
    try {
      const response = this.financeClient
        .send('invoiceClient/processInvoice', file)
        .pipe(timeout(50000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}
