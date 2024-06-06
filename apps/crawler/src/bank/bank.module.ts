import { Module, forwardRef } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';
import { CrawlerModule } from '../crawler.module';

@Module({
  imports: [forwardRef(() => CrawlerModule)],
  controllers: [BankController],
  providers: [BankService],
})
export class BankModule {}
