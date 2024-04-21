import { Module, forwardRef } from "@nestjs/common";
import { ExpenseditureController } from "./expensediture.controller";
import { ExpenseditureService } from "./expensediture.service";
import { FinanceModule } from "../finance.module";

@Module({
  imports: [forwardRef(() => FinanceModule)],
  controllers: [ExpenseditureController],
  providers: [ExpenseditureService],
})
export class ExpenseditureModule {}