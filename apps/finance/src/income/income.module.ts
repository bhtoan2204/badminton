import { Module, forwardRef } from '@nestjs/common';
import { IncomeController } from './income.controller';
import { IncomeService } from './income.service';
import { FinanceModule } from '../finance.module';
import {
  MainDatabaseModule,
  FinanceIncome,
  FinanceIncomeSource,
  MemberFamily,
} from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    forwardRef(() => FinanceModule),
    MainDatabaseModule,
    TypeOrmModule.forFeature([
      FinanceIncome,
      FinanceIncomeSource,
      MemberFamily,
    ]),
  ],
  controllers: [IncomeController],
  providers: [IncomeService],
})
export class IncomeModule {}
