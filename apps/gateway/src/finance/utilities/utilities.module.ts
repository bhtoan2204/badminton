import { forwardRef, Module } from '@nestjs/common';
import { UtilitiesController } from './utilities.controller';
import { UtilitiesService } from './utilities.service';
import { FinanceModule } from '../finance.module';

@Module({
  imports: [forwardRef(() => FinanceModule)],
  controllers: [UtilitiesController],
  providers: [UtilitiesService],
})
export class UtilitiesModule {}
