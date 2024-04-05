import { Controller, Get } from '@nestjs/common';
import { EducationService } from './education.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Controller()
export class EducationController {
  constructor(
    private readonly educationService: EducationService,
    private readonly rmqService: RmqService
  ) { }

  @EventPattern('educationClient/createEducationProgress')
  async createEducationProgress(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.educationService.createEducationProgress(data.id_user, data.dto);
  }
}
