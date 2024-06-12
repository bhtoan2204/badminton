import { forwardRef, Module } from '@nestjs/common';
import { InvoiceModule } from '../invoice.module';
import { UtilitiesController } from './utilities.controller';
import { UtilitiesService } from './utilities.service';

@Module({
  imports: [forwardRef(() => InvoiceModule)],
  controllers: [UtilitiesController],
  providers: [UtilitiesService],
})
export class UtilitiesModule {}
