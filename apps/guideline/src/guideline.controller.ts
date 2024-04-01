import { Controller } from '@nestjs/common';
import { GuidelineService } from './guideline.service';
import { RmqService } from '@app/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class GuidelineController {
  constructor(
    private readonly guidelineService: GuidelineService,
    private readonly rmqService: RmqService
  ) { }

  @EventPattern('guidelineClient/get_all_guideline')
  async getAllGuideline(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.guidelineService.getAllGuideline(data.id_user, data.id_family, data.page, data.itemsPerPage);
  }

  @EventPattern('guidelineClient/get_guideline')
  async getGuideline(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.guidelineService.getGuideline(data.id_user, data.id_family, data.id_guideline);
  }

  @EventPattern('guidelineClient/create_guideline')
  async createGuideline(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.guidelineService.createGuideline(data.id_user, data.dto);
  }

  @EventPattern('guidelineClient/update_guideline')
  async updateGuideline(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.guidelineService.updateGuideline(data.id_user, data.dto);
  }

  @EventPattern('guidelineClient/delete_guideline')
  async deleteGuideline(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.guidelineService.deleteGuideline(data.id_user, data.id_family, data.id_guideline);
  }

  @EventPattern('guidelineClient/get_step')
  async getStep(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.guidelineService.getStep(data.id_user, data.id_family, data.id_guideline);
  }

  @EventPattern('guidelineClient/add_step')
  async addStep(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.guidelineService.addStep(data.id_user, data.dto, data.file);
  }

  @EventPattern('guidelineClient/update_step')
  async updateStep(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.guidelineService.updateStep(data.id_user, data.dto, data.file);
  }

  @EventPattern('guidelineClient/delete_step')
  async deleteStep(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.guidelineService.deleteStep(data.id_user, data.id_family, data.id_guideline, data.index);
  }
}
