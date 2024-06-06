import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { ELASTICSEARCH_SERVICE } from '../../utils';

@Module({
  imports: [RmqModule.register({ name: ELASTICSEARCH_SERVICE })],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
