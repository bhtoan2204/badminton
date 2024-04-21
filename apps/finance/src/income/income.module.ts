import { Module, forwardRef } from "@nestjs/common";
import { IncomeController } from "./income.controller";
import { IncomeService } from "./income.service";
import { FinanceModule } from "../finance.module";

@Module({
  imports: [forwardRef(() => FinanceModule)],
  controllers: [IncomeController],
  providers: [IncomeService],
})
export class IncomeModule {}