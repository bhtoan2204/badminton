import { Controller, Get } from '@nestjs/common';
import { familyService } from './family.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';
import { createFamilyDto } from './dto/createFamilyDto.dto';

@Controller()
export class familyController {
  constructor(
    private readonly familyService: familyService,
    private readonly rmqService: RmqService) {}

  @EventPattern('family/get_Family')
  async getFamily(@Payload() id: number, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.familyService.getFamily(id);
  }

  @EventPattern('family/create_Family')
  async createFamily(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    const payload : createFamilyDto = data.createAccountDto;

    return this.familyService.createFamily(payload);
  }

  @EventPattern('family/update_Family')
  async updateFamily(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    const payload : createFamilyDto = data.createAccountDto;

    //return this.familyService.updateFamily(id, payload);
  }

  @EventPattern('family/delete_Family')
  async deleteFamily(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.familyService.deleteFamily(data.id);
  }
}

