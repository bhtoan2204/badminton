import { Module, forwardRef } from "@nestjs/common";
import { ExpenseditureController } from "./expensediture.controller";
import { ExpenseditureService } from "./expensediture.service";
import { FinanceModule } from "../finance.module";
import { ExpenseditureTypeModule } from "./expenditureType/expenseditureType.module";

@Module({
  imports: [
    forwardRef(() => FinanceModule),
    ExpenseditureTypeModule
  ],
  controllers: [ExpenseditureController],
  providers: [ExpenseditureService],
})
export class ExpenseditureModule {}