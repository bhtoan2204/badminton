import { Module, forwardRef } from '@nestjs/common';
import { SavingController } from './saving.controller';
import { SavingService } from './saving.service';
import { FinanceModule } from '../finance.module';

@Module({
  imports: [forwardRef(() => FinanceModule)],
  controllers: [SavingController],
  providers: [SavingService],
})
export class SavingModule {}
