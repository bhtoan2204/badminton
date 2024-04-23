import { Controller } from "@nestjs/common";
import { ExpenseditureService } from "./expensediture.service";
import { RmqService } from "@app/common";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";

@Controller()
export class ExpenseditureController {
  constructor(
    private readonly expenseService: ExpenseditureService,
    private readonly rmqService: RmqService
  ) { }

  @EventPattern('financeClient/getExpenseditureType')
  async getExpenseType(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.expenseService.getExpenseditureType();
  }
}