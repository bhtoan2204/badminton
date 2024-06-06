import { Module } from '@nestjs/common';
import { DatafetcherService } from './datafetcher.service';
import { DatafetcherController } from './datafetcher.controller';
import { RmqModule } from '@app/common';
import { ELASTICSEARCH_SERVICE } from '../../utils';

@Module({
  imports: [RmqModule.register({ name: ELASTICSEARCH_SERVICE })],
  controllers: [DatafetcherController],
  providers: [DatafetcherService],
})
export class DatafetcherModule {}
