import { Controller } from "@nestjs/common";
import { ExpenseditureService } from "./expensediture.service";
import { RmqService } from "@app/common";

@Controller()
export class ExpenseditureController {
  constructor(
    private readonly expenseService: ExpenseditureService,
    private readonly rmqService: RmqService
  ) { }
}