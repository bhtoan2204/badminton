import { Controller } from "@nestjs/common";
import { InvestmentService } from "./investment.service";
import { RmqService } from "@app/common";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";

@Controller()
export class InvestmentController {
  constructor(
    private readonly investmentService: InvestmentService,
    private readonly rmqService: RmqService
  ) { }

  @EventPattern('financeClient/getInvestmentType')
  async getInvestmentType(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.investmentService.getInvestmentType();
  }

  @EventPattern('financeClient/getInvestmentRiskLevel')
  async getInvestmentRiskLevel(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.investmentService.getInvestmentRiskLevel();
  }
}