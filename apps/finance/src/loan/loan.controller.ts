import { Controller } from '@nestjs/common';
import { LoanService } from './loan.service';
import { RmqService } from '@app/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class LoanController {
  constructor(
    private readonly loanService: LoanService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('financeClient/getLoanCreditorType')
  async getLoanCreditorType(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.loanService.getLoanCreditorType();
  }
}
