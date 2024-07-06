import { Module, forwardRef } from '@nestjs/common';
import { ExpenseditureController } from './expensediture.controller';
import { ExpenseditureService } from './expensediture.service';
import { FinanceModule } from '../finance.module';
import { StorageModule } from '../storage/storage.module';
import {
  DatabaseModule,
  FinanceExpenditure,
  FinanceExpenditureType,
  MemberFamily,
} from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    forwardRef(() => FinanceModule),
    StorageModule,
    DatabaseModule,
    TypeOrmModule.forFeature([
      FinanceExpenditure,
      FinanceExpenditureType,
      MemberFamily,
    ]),
  ],
  controllers: [ExpenseditureController],
  providers: [ExpenseditureService],
})
export class ExpenseditureModule {}
