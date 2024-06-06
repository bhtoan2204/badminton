import { Module, forwardRef } from '@nestjs/common';
import { IncomeSourceController } from './incomeSource.controller';
import { IncomeSourceService } from './incomeSource.service';
import { FinanceModule } from '../../finance.module';

@Module({
  imports: [forwardRef(() => FinanceModule)],
  controllers: [IncomeSourceController],
  providers: [IncomeSourceService],
})
export class IncomeSourceModule {}
