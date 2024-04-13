import { Controller, Get } from '@nestjs/common';
import { SearchService } from './elasticsearch.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Controller()
export class SearchController {
  constructor(
    private readonly elasticsearchService: SearchService,
    private readonly rmqService: RmqService
  ) { }

  @EventPattern('elasticsearchClient/getLogsCount')
  async getLogs(@Payload() data: any, @Ctx() context: RmqContext) {
    this
    return await this.elasticsearchService.getLogsCount();
  }
}
