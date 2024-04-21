import { Controller } from "@nestjs/common";
import { IncomeService } from "./income.service";
import { RmqService } from "@app/common";

@Controller()
export class IncomeController {
  constructor(
    private readonly incomeService: IncomeService,
    private readonly rmqService: RmqService
  ) { }
}