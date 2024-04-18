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
}
