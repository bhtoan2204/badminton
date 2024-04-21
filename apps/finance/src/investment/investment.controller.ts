import { Controller } from "@nestjs/common";
import { InvestmentService } from "./investment.service";
import { RmqService } from "@app/common";

@Controller()
export class InvestmentController {
  constructor(
    private readonly InvestmentService: InvestmentService,
    private readonly rmqService: RmqService
  ) { }

}