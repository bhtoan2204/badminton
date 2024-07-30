import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { FinanceService } from './finance.service';

@Module({
  imports: [RmqModule.register({ name: 'FINANCE' })],
  providers: [FinanceService],
  exports: [FinanceService],
})
export class FinanceModule {}
