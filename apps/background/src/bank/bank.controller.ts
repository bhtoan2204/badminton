import { Controller } from '@nestjs/common';
import { BankService } from './bank.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Controller()
export class BankController {
  constructor(
    private readonly bankService: BankService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('crawlerClient/scrapeInterestRatesLocalBank')
  async getBankData(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.bankService.scrapeInterestRatesLocalBank();
  }
}
