import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { BACKGROUND_SERVICE } from '../utils';
import { CrawlerController } from './crawler.controller';
import { CrawlerService } from './crawler.service';

@Module({
  imports: [RmqModule.register({ name: BACKGROUND_SERVICE })],
  controllers: [CrawlerController],
  providers: [CrawlerService],
})
export class CrawlerModule {}
