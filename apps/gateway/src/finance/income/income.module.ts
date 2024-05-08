import { Module, forwardRef } from "@nestjs/common";
import { IncomeController } from "./income.controller";
import { IncomeService } from "./income.service";
import { FinanceModule } from "../finance.module";
import { IncomeSourceModule } from "./incomeSource/incomeSource.module";

@Module({
  imports: [
    forwardRef(() => FinanceModule),
    IncomeSourceModule
  ],
  controllers: [IncomeController],
  providers: [IncomeService],
})
export class IncomeModule {}