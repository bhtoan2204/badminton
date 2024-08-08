import { Module } from '@nestjs/common';
import { FinanceExpenditureService } from './expenditure.service';
import {
  FinanceExpenditure,
  FinanceExpenditureType,
  MainDatabaseModule,
} from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    MainDatabaseModule,
    TypeOrmModule.forFeature([FinanceExpenditure, FinanceExpenditureType]),
  ],
  providers: [FinanceExpenditureService],
  exports: [FinanceExpenditureService],
})
export class FinanceExpenditureModule {}
