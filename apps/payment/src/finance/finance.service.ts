import { RmqService } from '@app/common';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';

@Injectable()
export class FinanceService {
  constructor(
    @Inject('FINANCE') private financeClient: ClientProxy,
    private readonly rmqService: RmqService,
  ) {}

  async addDefaultExpenseType(id_family: number) {
    try {
      return await this.rmqService.send(
        this.financeClient,
        'financeClient/addDefaultExpenseType',
        { id_family },
      );
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async addDefaultIncomeSource(id_family: number) {
    try {
      return await this.rmqService.send(
        this.financeClient,
        'financeClient/addDefaultIncomeSource',
        { id_family },
      );
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
