import { RmqModule } from '@app/common';
import { Module, forwardRef } from '@nestjs/common';
import { FAMILY_SERVICE, FINANCE_SERVICE, PermissionGuard } from '../utils';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { ExpenseditureModule } from './expensediture/expensediture.module';
import { IncomeModule } from './income/income.module';
import { AssetModule } from './asset/asset.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    RmqModule.register({ name: FINANCE_SERVICE }),
    RmqModule.register({ name: FAMILY_SERVICE }),
    forwardRef(() => ExpenseditureModule),
    forwardRef(() => IncomeModule),
    forwardRef(() => AssetModule),
  ],
  controllers: [FinanceController],
  providers: [
    FinanceService,
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
  exports: [RmqModule],
})
export class FinanceModule {}
