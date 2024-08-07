import {
  Calendar,
  CalendarResponse,
  CategoryEvent,
  ChecklistType,
  CreateDefaultChecklistTypeRequest,
  Empty,
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
    @InjectRepository(ChecklistType)
    private readonly checklistTypeRepository: Repository<ChecklistType>,
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

  async createDefaultChecklistType(
    request: CreateDefaultChecklistTypeRequest,
  ): Promise<Empty> {
    try {
      const id_family = request.idFamily;
      const defaultChecklistTypes = [
        {
          name_en: 'Daily Tasks',
          name_vn: 'Việc hằng ngày',
          icon_url:
            'https://lh3.googleusercontent.com/drive-viewer/AKGpihawGKcMy_7MCqKxATsVgZYndH__jY2eLPaZySWzfpq8I0XdEc4ZvPLvG5WZCekOTZH01EiRn5VB3un_aslz7WH2_DwptN10e6M=s2560',
          id_family,
        },
        {
          name_en: 'Work Tasks',
          name_vn: 'Công việc',
          icon_url:
            'https://lh3.googleusercontent.com/drive-viewer/AKGpihYo2_D0IPryCC2H06a90W8Mq3bzwkCjzA5ZtfBb7ePRtgLptN1bEycVzLrC3wqtkHz_vC5XTKzHVzjYLRFTU28Mf32YLX2n1Q=s2560',
          id_family,
        },
        {
          name_en: 'Personal Tasks',
          name_vn: 'Việc cá nhân',
          icon_url:
            'https://lh3.googleusercontent.com/drive-viewer/AKGpihbgf2a0_ZKqq-iBmO2Yp_7hH0IFf1MGiyRwO5rZ6PyydtwYtUl21cklqa4oXYgIDR_VItmwNTxzN_biuu-P335q-OfvWIWENtY=s2560',
          id_family,
        },
        {
          name_en: 'Household Chores',
          name_vn: 'Việc nhà',
          icon_url:
            'https://lh3.googleusercontent.com/drive-viewer/AKGpihZQ86klb3RhE3mlstdC4wTuim2xKMENYarhnqnjx4i554aStfsHaXJ6PZXKWdDUnKQ_AbiDMjUfQ0EXoEzrAkXbzap7GlXa=s2560',
          id_family,
        },
        {
          name_en: 'Travel Plans',
          name_vn: 'Du lịch',
          icon_url:
            'https://lh3.googleusercontent.com/drive-viewer/AKGpihbT_b6QPM6Gx27MuWhOfnsQ2yWITBzAzgnyJ0vBFmbo7idCUdzp85r7_wc--szPdp7j_l_NZncF-ogqC6XWYq6Df-sYwh48TDM=s2560',
          id_family,
        },
        {
          name_en: 'Project Deadlines',
          name_vn: 'Hạn chót công việc',
          icon_url:
            'https://lh3.googleusercontent.com/drive-viewer/AKGpihbLuoK7Wp2QHeZ1g0xBpEePQkaWo0LLWfx-g7w7BoEb2HH_7IocApTUJUyUikhuDedGE90OrB5gATemH4IlUyC7sI6ssh5XYg=s2560',
          id_family,
        },
        {
          name_en: 'Appointments',
          name_vn: 'Cuộc hẹn',
          icon_url:
            'https://lh3.googleusercontent.com/drive-viewer/AKGpihagfFAbppn3ZYq-5RU5_jdQQKGUACNCFkDB3M_-jsCOSi3P21bSiZ_Vy5WfckXqw6yqQqNXW9CWv7xaefE0Zg7-7DoX0P5ZEFU=s2560',
          id_family,
        },
        {
          name_en: 'Errands',
          name_vn: 'Việc vặt',
          icon_url:
            'https://lh3.googleusercontent.com/drive-viewer/AKGpihaL60lRiZ44Dlc8Ns2CzQwMhgKS4SWx73OlT7K1dusvwwRJStD3l-YQuYpyF4F2s2A-E8_nMhD2V320KSNxYY62zyBaA3xn4lw=s2560',
          id_family,
        },
        {
          name_en: 'Other',
          name_vn: 'Khác',
          icon_url:
            'https://lh3.googleusercontent.com/drive-viewer/AKGpihYggGhyOFyUPRm7VyJcZLkBADL-GiGfZuengKF_62XJHmTLJHNHGV3e4YAH2T4yKH4HWH3BgibtYHjWQqJEQ7gehz5uKm-utcY=s2560',
          id_family,
        },
      ];
      await this.checklistTypeRepository.save(
        defaultChecklistTypes.map((type) =>
          this.checklistTypeRepository.create(type),
        ),
      );
      return {};
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
