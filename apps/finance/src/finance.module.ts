import { Module, forwardRef } from '@nestjs/common';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
import { DatabaseModule, RmqModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AssetModule } from './asset/asset.module';
import { ExpenseditureModule } from './expensediture/expensediture.module';
import { IncomeModule } from './income/income.module';
import { InvestmentModule } from './investment/investment.module';
import { LoanModule } from './loan/loan.module';
import { SavingModule } from './saving/saving.module';
import { FamilyWalletModule } from './familyWallet/familyWallet.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_FINANCE_QUEUE: Joi.string().required(),
      }),
      envFilePath: process.env.NODE_ENV === 'production' ? './apps/finance/.env.production' : './apps/finance/.env',
    }),
    RmqModule,
    DatabaseModule,
    forwardRef(() => AssetModule),
    forwardRef(() => ExpenseditureModule),
    forwardRef(() => IncomeModule),
    forwardRef(() => InvestmentModule),
    forwardRef(() => LoanModule),
    forwardRef(() => SavingModule),
    forwardRef(() => FamilyWalletModule)
  ],
  controllers: [FinanceController],
  providers: [FinanceService],
  exports: [RmqModule, DatabaseModule]
})
export class FinanceModule {}
