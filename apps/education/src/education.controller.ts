import { Controller } from '@nestjs/common';
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

  @EventPattern('educationClient/getAllEducationProgress')
  async getAllEducationProgress(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.educationService.getAllEducationProgress(data.id_user, data.pageNumber, data.itemsPerPage, data.id_family);
  }

  @EventPattern('educationClient/getDetailEducationProgress')
  async getDetailEducationProgress(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.educationService.getDetailEducationProgress(data.id_user, data.id_family, data.id_education_progress);
  }

  @EventPattern('educationClient/createSubject')
  async createSubject(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.educationService.createSubject(data.id_user, data.dto);
  }

  @EventPattern('educationClient/getDetailSubject')
  async getDetailSubject(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.educationService.getDetailSubject(data.id_user, data.id_family, data.id_education_progress, data.id_subject);
  }
}
