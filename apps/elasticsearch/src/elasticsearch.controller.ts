import { Controller } from '@nestjs/common';
import { SearchService } from './elasticsearch.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Controller()
export class SearchController {
  constructor(
    private readonly elasticsearchService: SearchService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('elasticsearchClient/getLogsCount')
  async getLogsCount(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.elasticsearchService.getLogsCount();
  }

  @EventPattern('elasticsearchClient/getLogs')
  async getLogs(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.elasticsearchService.getLogs(data);
  }

  @EventPattern('elasticsearchClient/getLogsCountByTimeRange')
  async getLogsCountByTimeRange(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    return await this.elasticsearchService.getLogsCountByTimeRange(data);
  }

  @EventPattern('elasticsearchClient/getServiceLogsTypeByTimeRange')
  async getServiceLogsTypeByTimeRange(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    console.log(data);
    return await this.elasticsearchService.getServiceLogsTypeByTimeRange(data);
  }
}
