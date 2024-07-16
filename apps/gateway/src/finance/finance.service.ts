import { HttpException, Inject, Injectable } from '@nestjs/common';
import { FINANCE_SERVICE } from '../utils';
import { ClientProxy } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Injectable()
export class FinanceService {
  constructor(
    @Inject(FINANCE_SERVICE) private financeClient: ClientProxy,
    private readonly rmqService: RmqService,
  ) {}

  async getFinanceSummary(id_user: string, id_family: number) {
    try {
      return await this.rmqService.send(
        this.financeClient,
        'financeClient/getFinanceSummary',
        { id_user, id_family },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async processInvoice(file: Express.Multer.File) {
    try {
      return await this.rmqService.send(
        this.financeClient,
        'invoiceClient/processInvoice',
        file,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }
}
