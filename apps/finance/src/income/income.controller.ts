import { Controller } from "@nestjs/common";
import { IncomeService } from "./income.service";
import { RmqService } from "@app/common";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";

@Controller()
export class IncomeController {
  constructor(
    private readonly incomeService: IncomeService,
    private readonly rmqService: RmqService
  ) { }

  @EventPattern('financeClient/getIncomeSource')
  async getIncomeSource(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.incomeService.getIncomeSource();
  }
}