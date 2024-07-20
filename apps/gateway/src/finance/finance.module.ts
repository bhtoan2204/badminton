import { Module, forwardRef } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { ExpenseditureModule } from './expensediture/expensediture.module';
import { IncomeModule } from './income/income.module';
import { AssetModule } from './asset/asset.module';
import { UtilitiesModule } from './utilities/utilities.module';

@Module({
  imports: [
    forwardRef(() => ExpenseditureModule),
    forwardRef(() => IncomeModule),
    forwardRef(() => AssetModule),
    forwardRef(() => UtilitiesModule),
  ],
  controllers: [FinanceController],
  providers: [FinanceService],
})
export class FinanceModule {}
