import { RmqModule } from "@app/common";
import { Module, forwardRef } from "@nestjs/common";
import { FINANCE_SERVICE } from "../utils";
import { FinanceService } from "./finance.service";
import { FinanceController } from "./finance.controller";
import { ExpenseditureModule } from "./expensediture/expensediture.module";
import { IncomeModule } from "./income/income.module";
import { LoanModule } from "./loan/loan.module";
import { SavingModule } from "./saving/saving.module";
import { InvestmentModule } from "./investment/investment.module";
import { AssetModule } from "./asset/asset.module";

@Module({
  imports: [
    RmqModule.register({ name: FINANCE_SERVICE }),
    forwardRef(() => AssetModule),
    forwardRef(() => ExpenseditureModule),
    forwardRef(() => IncomeModule),
    forwardRef(() => InvestmentModule),
    forwardRef(() => LoanModule),
    forwardRef(() => SavingModule)
  ],
  controllers: [FinanceController],
  providers: [FinanceService],
  exports: [RmqModule]
})
export class FinanceModule {}