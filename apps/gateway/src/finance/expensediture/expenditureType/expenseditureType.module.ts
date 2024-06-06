import { Module, forwardRef } from '@nestjs/common';
import { ExpenseditureTypeController } from './expenseditureType.controller';
import { ExpenseditureTypeService } from './expenseditureType.service';
import { FinanceModule } from '../../finance.module';

@Module({
  imports: [forwardRef(() => FinanceModule)],
  controllers: [ExpenseditureTypeController],
  providers: [ExpenseditureTypeService],
})
export class ExpenseditureTypeModule {}
