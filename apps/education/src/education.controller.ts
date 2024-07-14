import { Controller } from '@nestjs/common';
import { EducationService } from './education.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Controller()
export class EducationController {
  constructor(
    private readonly educationService: EducationService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('educationClient/createEducationProgress')
  async createEducationProgress(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    return this.educationService.createEducationProgress(
      data.id_user,
      data.dto,
    );
  }

  @EventPattern('educationClient/getAllEducationProgress')
  async getAllEducationProgress(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    return this.educationService.getAllEducationProgress(
      data.id_user,
      data.pageNumber,
      data.itemsPerPage,
      data.id_family,
      data.search,
      data.member_id,
    );
  }

  @EventPattern('educationClient/getDetailEducationProgress')
  async getDetailEducationProgress(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    return this.educationService.getDetailEducationProgress(
      data.id_user,
      data.id_family,
      data.id_education_progress,
    );
  }

  @EventPattern('educationClient/updateDetailEducationProgress')
  async updateDetailEducationProgress(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    return this.educationService.updateDetailEducationProgress(
      data.id_user,
      data.dto,
    );
  }

  @EventPattern('educationClient/deleteEducationProgress')
  async deleteEducationProgress(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    return this.educationService.deleteEducationProgress(
      data.id_user,
      data.id_family,
      data.id_education_progress,
    );
  }

  @EventPattern('educationClient/createSubject')
  async createSubject(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.educationService.createSubject(data.id_user, data.dto);
  }

  @EventPattern('educationClient/getDetailSubject')
  async getDetailSubject(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.educationService.getDetailSubject(
      data.id_user,
      data.id_family,
      data.id_education_progress,
      data.id_subject,
    );
  }

  @EventPattern('educationClient/updateDetailSubject')
  async updateDetailSubject(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.educationService.updateDetailSubject(data.id_user, data.dto);
  }

  @EventPattern('educationClient/deleteSubject')
  async deleteSubject(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.educationService.deleteSubject(
      data.id_user,
      data.id_family,
      data.id_education_progress,
      data.id_subject,
    );
  }

  @EventPattern('educationClient/addComponentScore')
  async addComponentScore(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.educationService.addComponentScore(data.id_user, data.dto);
  }

  @EventPattern('educationClient/insertComponentScore')
  async insertComponentScore(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.educationService.insertComponentScore(data.id_user, data.dto);
  }

  @EventPattern('educationClient/updateComponentScore')
  async updateComponentScore(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.educationService.updateComponentScore(data.id_user, data.dto);
  }

  @EventPattern('educationClient/deleteComponentScore')
  async deleteComponentScore(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.educationService.deleteComponentScore(data.id_user, data.dto);
  }

  @EventPattern('educationClient/modifyScore')
  async modifyScore(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.educationService.modifyScore(data.id_user, data.dto);
  }

  @EventPattern('educationClient/removeScore')
  async removeScore(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.educationService.removeScore(data.id_user, data.dto);
  }

  @EventPattern('educationClient/changeStatus')
  async changeStatus(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.educationService.changeStatus(data.id_user, data.dto);
  }
}
