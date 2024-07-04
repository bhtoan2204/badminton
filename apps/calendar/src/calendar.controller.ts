import { Controller } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { RmqService } from '@app/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class CalendarController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly calendarService: CalendarService,
  ) {}

  @EventPattern('calendarClient/getAllCategoryEvent')
  async getAllCategoryEvent(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.calendarService.getAllCategoryEvent(
      data.id_user,
      data.id_family,
    );
  }

  @EventPattern('calendarClient/createCategoryEvent')
  async createCategoryEvent(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.calendarService.createCategoryEvent(data.id_user, data.dto);
  }

  @EventPattern('calendarClient/updateCategoryEvent')
  async updateCategoryEvent(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.calendarService.updateCategoryEvent(data.id_user, data.dto);
  }

  @EventPattern('calendarClient/deleteCategoryEvent')
  async deleteCategoryEvent(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.calendarService.deleteCategoryEvent(
      data.id_user,
      data.id_family,
      data.id_category_event,
    );
  }

  @EventPattern('calendarClient/getAllCalendar')
  async getAllCalendar(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.calendarService.getAllCalendar(data.id_user, data.id_family);
  }

  @EventPattern('calendarClient/getEventOnDate')
  async getEventOnDate(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.calendarService.getEventOnDate(data.id_user, data.dto);
  }

  @EventPattern('calendarClient/getCalendarDetail')
  async getCalendarDetail(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.calendarService.getCalendarDetail(
      data.id_user,
      data.id_calendar,
      data.id_family,
    );
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
    return this.calendarService.deleteCalendar(
      data.id_user,
      data.id_calendar,
      data.id_family,
    );
  }
}
