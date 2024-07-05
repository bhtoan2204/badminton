import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';
import { UtilitiesService } from './utilities.service';

@Controller()
export class UtilitiesController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly utilitiesService: UtilitiesService,
  ) {}

  @EventPattern('financeClient/getUtilityTypes')
  async getUtilityTypes(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.utilitiesService.getUtilityTypes();
  }

  @EventPattern('financeClient/getUtilities')
  async getUtilities(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.utilitiesService.getUtilities(
      data.id_family,
      data.page,
      data.itemsPerPage,
    );
  }

  @EventPattern('financeClient/getUtility')
  async getUtility(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.utilitiesService.getUtility(data.id_family, data.id_utility);
  }

  @EventPattern('financeClient/createUtility')
  async createUtility(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.utilitiesService.createUtility(
      data.id_user,
      data.dto,
      data.file,
    );
  }

  @EventPattern('financeClient/updateUtility')
  async updateUtility(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.utilitiesService.updateUtility(
      data.id_user,
      data.dto,
      data.file,
    );
  }

  @EventPattern('financeClient/deleteUtility')
  async deleteUtility(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.utilitiesService.deleteUtility(data.id_family, data.id_utility);
  }
}
