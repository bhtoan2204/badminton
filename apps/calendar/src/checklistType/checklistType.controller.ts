import { Controller } from '@nestjs/common';
import { ChecklistTypeService } from './checklistType.service';
import { RmqService } from '@app/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class ChecklistTypeController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly checklistTypeService: ChecklistTypeService,
  ) {}

  @EventPattern('calendarClient/getChecklistTypes')
  async getChecklistTypes(@Ctx() context: RmqContext, @Payload() data: any) {
    this.rmqService.ack(context);
    return this.checklistTypeService.getChecklistTypes(data.id_family);
  }

  @EventPattern('calendarClient/createChecklistType')
  async createChecklistType(
    @Ctx() context: RmqContext,
    @Payload()
    data: {
      dto: {
        name: string;
        id_family: number;
        icon_url: string;
        id_calendar: number;
      };
    },
  ) {
    this.rmqService.ack(context);
    return this.checklistTypeService.createChecklistType(data.dto);
  }

  @EventPattern('calendarClient/updateChecklistType')
  async updateChecklistType(
    @Ctx() context: RmqContext,
    @Payload()
    data: {
      dto: {
        id_checklist_type: number;
        id_family: number;
        name_vn: string;
        name_en: string;
      };
    },
  ) {
    this.rmqService.ack(context);
    return this.checklistTypeService.updateChecklistType(data.dto);
  }
}
