import { Module, forwardRef } from '@nestjs/common';
import { ExpenseditureController } from './expensediture.controller';
import { ExpenseditureService } from './expensediture.service';
import { FinanceModule } from '../finance.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [forwardRef(() => FinanceModule), StorageModule],
  controllers: [ExpenseditureController],
  providers: [ExpenseditureService],
})
export class ExpenseditureModule {}
