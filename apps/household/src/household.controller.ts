import { Controller } from '@nestjs/common';
import { HouseholdService } from './household.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Controller()
export class HouseholdController {
  constructor(
    private readonly householdService: HouseholdService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('householdClient/getCategory')
  async getHouseholdCategory(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.householdService.getCategory();
  }

  @EventPattern('householdClient/getItem')
  async getItem(
    @Payload()
    data: {
      id_user: string;
      dto: {
        id_family: number;
        page: number;
        itemsPerPage: number;
        sortBy: string;
        sortDirection: 'ASC' | 'DESC';
      };
    },
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    return await this.householdService.getItem(data.id_user, data.dto);
  }

  @EventPattern('householdClient/getItemDetail')
  async getItemDetail(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.householdService.getItemDetail(
      data.id_user,
      data.id_family,
      data.id_item,
    );
  }

  @EventPattern('householdClient/createItem')
  async createItem(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.householdService.createItem(
      data.id_user,
      data.dto,
      data.file,
    );
  }

  @EventPattern('householdClient/updateItem')
  async updateItem(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.householdService.updateItem(
      data.id_user,
      data.dto,
      data.file,
    );
  }

  @EventPattern('householdClient/inputDurableItem')
  async inputDurableItem(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.householdService.inputDurableItem(data.id_user, data.dto);
  }

  @EventPattern('householdClient/inputConsumableItem')
  async inputConsumableItem(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.householdService.inputConsumableItem(
      data.id_user,
      data.dto,
    );
  }

  @EventPattern('householdClient/deleteItem')
  async deleteItem(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.householdService.deleteItem(
      data.id_user,
      data.id_family,
      data.id_item,
    );
  }

  @EventPattern('householdClient/getLowConditionItem')
  async getLowConditionItem(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.householdService.getLowConditionItem(
      data.id_user,
      data.id_family,
    );
  }
}
