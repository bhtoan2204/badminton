import { Module, forwardRef } from '@nestjs/common';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
import { MainDatabaseModule, RmqModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { AssetModule } from './asset/asset.module';
import { ExpenseditureModule } from './expensediture/expensediture.module';
import { IncomeModule } from './income/income.module';
import { UtilitiesModule } from './utilities/utilities.module';
import * as Joi from 'joi';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_FINANCE_QUEUE: Joi.string().required(),
      }),
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? './apps/finance/.env.production'
          : './apps/finance/.env',
    }),
    RmqModule,
    MainDatabaseModule,
    forwardRef(() => AssetModule),
    forwardRef(() => ExpenseditureModule),
    forwardRef(() => IncomeModule),
    forwardRef(() => UtilitiesModule),
  ],
  controllers: [FinanceController],
  providers: [FinanceService],
  exports: [RmqModule, MainDatabaseModule],
})
export class FinanceModule {}
