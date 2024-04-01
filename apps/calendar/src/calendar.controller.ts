import { Controller } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { RmqService } from '@app/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class CalendarController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly calendarService: CalendarService) { }

  @EventPattern('calendarClient/getAllCalendar')
  async getAllCalendar(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.calendarService.getAllCalendar(data.id_user, data.id_family);
  }

  @EventPattern('calendarClient/getCalendarDetail')
  async getCalendarDetail(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.calendarService.getCalendarDetail(data.id_user, data.id_calendar);
  }

  @EventPattern('calendarClient/createCalendar')
  async createCalendar(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.calendarService.createCalendar(data.id_user, data.dto);
  }

  @EventPattern('calendarClient/updateCalendar')
  async updateCalendar(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.calendarService.updateCalendar(data.id_user, data.dto);
  }

  @EventPattern('calendarClient/deleteCalendar')
  async deleteCalendar(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.calendarService.deleteCalendar(data.id_user, data.id_calendar);
  }
}
