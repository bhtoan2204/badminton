import { Controller, Get } from '@nestjs/common';
import { HouseholdService } from './household.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Controller()
export class HouseholdController {
  constructor(
    private readonly householdService: HouseholdService,
    private readonly rmqService: RmqService) {}

  @EventPattern('householdClient/getCategory')
  async getHouseholdCategory(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.householdService.getCategory();
  }

  @EventPattern('householdClient/getItem')
  async getItem(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.householdService.getItem(data.id_user, data.id_family, data.page, data.itemsPerPage);
  }

  @EventPattern('householdClient/getItemDetail')
  async getItemDetail(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.householdService.getItemDetail(data.id_user, data.id_family, data.id_item);
  }

  @EventPattern('householdClient/createItem')
  async createItem(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.householdService.createItem(data.id_user, data.dto, data.file);
  }

  @EventPattern('householdClient/deleteItem')
  async deleteItem(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.householdService.deleteItem(data.id_user, data.id_family, data.id_item);
  }
}
