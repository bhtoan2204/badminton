import { Module, forwardRef } from "@nestjs/common";
import { LoanController } from "./loan.controller";
import { LoanService } from "./loan.service";
import { FinanceModule } from "../finance.module";

@Module({
  imports: [forwardRef(() => FinanceModule)],
  controllers: [LoanController],
  providers: [LoanService],
})
export class LoanModule {}