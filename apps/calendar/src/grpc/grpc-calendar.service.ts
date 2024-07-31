import {
  Calendar,
  CalendarResponse,
  CategoryEvent,
  FindCalendarByFrequencyRequest,
  FindCalendarByFrequencyResponse,
  FindOneByIdRequest,
} from '@app/common';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

@Injectable()
export class GrpcCalendarService {
  constructor(
    @InjectRepository(Calendar)
    private readonly calendarRepository: Repository<Calendar>,
    @InjectRepository(CategoryEvent)
    private readonly categoryEventRepository: Repository<CategoryEvent>,
  ) {}

  async findCalendarByFrequency(
    request: FindCalendarByFrequencyRequest,
  ): Promise<FindCalendarByFrequencyResponse> {
    try {
      const repeatlyEvents = await this.calendarRepository.find({
        where: { recurrence_rule: Like(`%FREQ=${request.frequency}%`) },
      });

      return {
        calendar: repeatlyEvents.map((event) => ({
          idCalendar: event.id_calendar,
          idFamily: event.id_family,
          category: event.category,
          title: event.title,
          description: event.description,
          timeStart: event.time_start.toISOString(),
          timeEnd: event.time_end.toISOString(),
          allDay: event.is_all_day,
          location: event.location,
          color: event.color,
          startTimezone: event.start_timezone,
          endTimezone: event.end_timezone,
          recurrenceId: event.recurrence_id,
          recurrenceException: event.recurrence_exception,
          recurrenceRule: event.recurrence_rule,
          createdAt: event.created_at.toISOString(),
          updatedAt: event.updated_at.toISOString(),
        })),
      };
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async findCalendarById(req: FindOneByIdRequest): Promise<CalendarResponse> {
    try {
      const calendar = await this.calendarRepository.findOne({
        where: {
          id_calendar: req.idCalendar,
        },
      });
      return {
        idCalendar: calendar.id_calendar,
        idFamily: calendar.id_family,
        category: calendar.category,
        title: calendar.title,
        description: calendar.description,
        timeStart: calendar.time_start.toISOString(),
        timeEnd: calendar.time_end.toISOString(),
        allDay: calendar.is_all_day,
        location: calendar.location,
        color: calendar.color,
        startTimezone: calendar.start_timezone,
        endTimezone: calendar.end_timezone,
        recurrenceId: calendar.recurrence_id,
        recurrenceException: calendar.recurrence_exception,
        recurrenceRule: calendar.recurrence_rule,
        createdAt: calendar.created_at.toISOString(),
        updatedAt: calendar.updated_at.toISOString(),
      };
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
