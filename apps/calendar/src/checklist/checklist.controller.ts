import { Controller } from '@nestjs/common';
import { ChecklistService } from './checklist.service';
import { RmqService } from '@app/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class ChecklistController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly checklistService: ChecklistService,
  ) {}

  @EventPattern('calendarClient/getChecklistTypes')
  async getChecklistTypes(@Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.checklistService.getChecklistTypes();
  }

  @EventPattern('calendarClient/getAllChecklist')
  async getChecklists(@Ctx() context: RmqContext, @Payload() data: any) {
    this.rmqService.ack(context);
    return this.checklistService.getChecklists(
      data.id_user,
      data.id_family,
      data.page,
      data.itemsPerPage,
    );
  }

  @EventPattern('calendarClient/createChecklist')
  async createChecklist(@Ctx() context: RmqContext, @Payload() data: any) {
    this.rmqService.ack(context);
    return this.checklistService.createChecklist(data.id_user, data.dto);
  }

  @EventPattern('calendarClient/updateChecklist')
  async updateChecklist(@Ctx() context: RmqContext, @Payload() data: any) {
    this.rmqService.ack(context);
    return this.checklistService.updateChecklist(data.id_user, data.dto);
  }

  @EventPattern('calendarClient/deleteChecklist')
  async deleteChecklist(@Ctx() context: RmqContext, @Payload() data: any) {
    this.rmqService.ack(context);
    return this.checklistService.deleteChecklist(
      data.id_user,
      data.id_family,
      data.id_checklist,
    );
  }
}
