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
import { Between, IsNull, Not, Repository } from 'typeorm';
import { addDays, addWeeks, addMonths, addYears } from 'date-fns';

@Injectable()
export class GrpcCalendarService {
  constructor(
    @InjectRepository(Calendar)
    private readonly calendarRepository: Repository<Calendar>,
    @InjectRepository(CategoryEvent)
    private readonly categoryEventRepository: Repository<CategoryEvent>,
  ) {}

  async findCalendarByFrequency(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request: FindCalendarByFrequencyRequest,
  ): Promise<FindCalendarByFrequencyResponse> {
    try {
      const currentDate = new Date();
      const repeatlyEvents = await this.calendarRepository.find({
        where: {
          recurrence_rule: Not(IsNull()),
        },
      });
      const events = repeatlyEvents.filter((event) => {
        const { recurrence_rule, time_start } = event;
        const rules = recurrence_rule.split(';');
        const frequencyRule = rules.find((rule) => rule.startsWith('FREQ='));
        const intervalRule = rules.find((rule) => rule.startsWith('INTERVAL='));
        const countRule = rules.find((rule) => rule.startsWith('COUNT='));

        const frequency = frequencyRule ? frequencyRule.split('=')[1] : null;
        const interval = intervalRule
          ? parseInt(intervalRule.split('=')[1], 10)
          : 1;
        const count = countRule ? parseInt(countRule.split('=')[1], 10) : null;

        if (!frequency || !time_start) {
          return false;
        }

        const startDate = new Date(time_start);
        let occurrenceDate = startDate;
        let occurrenceCount = 0;

        while (
          occurrenceDate <= currentDate &&
          (!count || occurrenceCount < count)
        ) {
          if (occurrenceDate.toDateString() === currentDate.toDateString()) {
            return true;
          }

          occurrenceCount += 1;
          switch (frequency) {
            case 'DAILY':
              occurrenceDate = addDays(startDate, interval * occurrenceCount);
              break;
            case 'WEEKLY':
              occurrenceDate = addWeeks(startDate, interval * occurrenceCount);
              break;
            case 'MONTHLY':
              occurrenceDate = addMonths(startDate, interval * occurrenceCount);
              break;
            case 'YEARLY':
              occurrenceDate = addYears(startDate, interval * occurrenceCount);
              break;
            default:
              return false;
          }
        }

        return false;
      });

      return {
        calendar: events.map((event) => ({
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

  async findNonRepeatCalendar(): Promise<FindCalendarByFrequencyResponse> {
    try {
      const currentDate = new Date();
      const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));
      const nonRepeatlyEvents = await this.calendarRepository.find({
        where: {
          recurrence_rule: null,
          time_start: Between(startOfDay, endOfDay),
        },
      });

      return {
        calendar: nonRepeatlyEvents.map((event) => ({
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
}
