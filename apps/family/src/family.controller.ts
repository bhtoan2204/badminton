import { Controller, Get } from '@nestjs/common';
import { FamilyService } from './family.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Controller()
export class FamilyController {
  constructor(
    private readonly familyService: FamilyService,
    private readonly rmqService: RmqService) {}

  @EventPattern('family/getFamily')
  async getFamily(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.familyService.getFamily(data.id_family);
  }
}
