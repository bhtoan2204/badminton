import { Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';
import { RmqModule } from '@app/common';

@Module({
  imports: [RmqModule],
  controllers: [BankController],
  providers: [BankService],
})
export class BankModule {}
