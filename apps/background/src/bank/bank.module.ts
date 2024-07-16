import { Module, forwardRef } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';
import { BackgroundModule } from '../background.module';

@Module({
  imports: [forwardRef(() => BackgroundModule)],
  controllers: [BankController],
  providers: [BankService],
})
export class BankModule {}
