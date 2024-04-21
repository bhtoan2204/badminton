import { Controller, Get } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { RmqService } from '@app/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class FinanceController {
  constructor(
    private readonly financeService: FinanceService,
    private readonly rmqService: RmqService
  ) {}

  @EventPattern('finance/getallfinance')
  async getallfinance(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.financeService.getAllFinance();
  }
}
