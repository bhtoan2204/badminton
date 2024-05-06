import { RmqModule } from "@app/common";
import { Module, forwardRef } from "@nestjs/common";
import { FINANCE_SERVICE } from "../utils";
import { FinanceService } from "./finance.service";
import { FinanceController } from "./finance.controller";
import { ExpenseditureModule } from "./expensediture/expensediture.module";
import { IncomeModule } from "./income/income.module";
import { AssetModule } from "./asset/asset.module";
import { WalletModule } from "./wallet/wallet.module";

@Module({
  imports: [
    RmqModule.register({ name: FINANCE_SERVICE }),
    forwardRef(() => ExpenseditureModule),
    forwardRef(() => IncomeModule),
    forwardRef(() => AssetModule),
    forwardRef(() => WalletModule)
  ],
  controllers: [FinanceController],
  providers: [FinanceService],
  exports: [RmqModule]
})
export class FinanceModule {}