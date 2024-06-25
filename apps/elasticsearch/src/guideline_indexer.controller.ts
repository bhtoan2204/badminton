import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';
import { GuidelineIndexerService } from './guideline_indexer.service';

@Controller()
export class GuidelineIndexerController {
  constructor(
    private readonly guidelineIndexerService: GuidelineIndexerService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('guidelineIndexer/indexGuideline')
  async indexGuideline(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.guidelineIndexerService.indexGuideline(data.data);
  }

  @EventPattern('guidelineIndexer/deleteGuideline')
  async deleteGuideline(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    this.guidelineIndexerService.deleteGuideline(data.id_guide_item);
  }

  @EventPattern('guidelineIndexer/searchGuideline')
  async searchGuideline(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.guidelineIndexerService.searchGuideline(data);
  }
}
