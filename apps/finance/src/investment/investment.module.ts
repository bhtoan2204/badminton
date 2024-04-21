import { Module, forwardRef } from "@nestjs/common";
import { InvestmentController } from "./investment.controller";
import { InvestmentService } from "./investment.service";
import { FinanceModule } from "../finance.module";

@Module({
  imports: [forwardRef(() => FinanceModule)],
  controllers: [InvestmentController],
  providers: [InvestmentService],
})
export class InvestmentModule {}