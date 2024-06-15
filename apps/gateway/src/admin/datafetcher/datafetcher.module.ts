import { forwardRef, Module } from '@nestjs/common';
import { DatafetcherService } from './datafetcher.service';
import { DatafetcherController } from './datafetcher.controller';
import { AdminModule } from '../admin.module';

@Module({
  imports: [forwardRef(() => AdminModule)],
  controllers: [DatafetcherController],
  providers: [DatafetcherService],
})
export class DatafetcherModule {}
