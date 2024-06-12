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

  @EventPattern('utilitiesClient/getUtilityTypes')
  async getUtilityTypes(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.utilitiesService.getUtilityTypes();
  }

  @EventPattern('utilitiesClient/getUtilities')
  async getUtilities(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.utilitiesService.getUtilities(
      data.id_family,
      data.page,
      data.itemsPerPage,
    );
  }

  @EventPattern('utilitiesClient/getUtility')
  async getUtility(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.utilitiesService.getUtility(data.id_family, data.id_utility);
  }

  @EventPattern('utilitiesClient/createUtility')
  async createUtility(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.utilitiesService.createUtility(
      data.id_user,
      data.dto,
      data.file,
    );
  }

  @EventPattern('utilitiesClient/updateUtility')
  async updateUtility(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.utilitiesService.updateUtility(
      data.id_user,
      data.dto,
      data.file,
    );
  }

  @EventPattern('utilitiesClient/deleteUtility')
  async deleteUtility(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.utilitiesService.deleteUtility(data.id_family, data.id_utility);
  }
}
