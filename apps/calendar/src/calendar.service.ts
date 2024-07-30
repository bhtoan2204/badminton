import { Calendar, CategoryEvent } from '@app/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import {
  And,
  EntityManager,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';

@Injectable()
export class CalendarService {
  constructor(
    private readonly configService: ConfigService,
    private readonly entityManager: EntityManager,
    @InjectRepository(Calendar)
    private readonly calendarRepository: Repository<Calendar>,
    @InjectRepository(CategoryEvent)
    private readonly categoryEventRepository: Repository<CategoryEvent>,
  ) {}

  async getAllCategoryEvent(id_user: string, id_family: number) {
    try {
      const [data, total] = await this.categoryEventRepository.findAndCount({
        where: { id_family },
        order: { created_at: 'DESC' },
      });
      return {
        message: 'Success',
        data: data,
        total: total,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async createCategoryEvent(id_user: string, dto: any) {
    try {
      const { title, color, id_family } = dto;

      const newCategoryEvent = new CategoryEvent();
      newCategoryEvent.title = title;
      newCategoryEvent.color = color;
      newCategoryEvent.id_family = id_family;

      const savedCategoryEvent =
        await this.categoryEventRepository.save(newCategoryEvent);

      return {
        message: 'Success',
        data: savedCategoryEvent,
      };
    } catch (error) {
      console.error('Error:', error);
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateCategoryEvent(id_user: string, dto: any) {
    try {
      const { id_category_event, title, color, id_family } = dto;

      const categoryEvent = await this.categoryEventRepository.findOne({
        where: { id_category_event, id_family },
      });
      if (!categoryEvent) {
        throw new RpcException({
          message: 'Category event not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      if (title) categoryEvent.title = title;
      if (color) categoryEvent.color = color;
      const data = await this.categoryEventRepository.save(categoryEvent);
      return {
        message: 'Success',
        data: data,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
  async deleteCategoryEvent(
    id_user: string,
    id_family: number,
    id_category_event: number,
  ) {
    try {
      const categoryEvent = await this.categoryEventRepository.findOne({
        where: { id_category_event, id_family },
      });
      if (!categoryEvent) {
        throw new RpcException({
          message: 'Category event not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      await this.categoryEventRepository.remove(categoryEvent);
      return {
        message: 'Success',
        data: categoryEvent,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getAllCalendar(id_user: string, id_family: number) {
    try {
      const [data, total] = await this.calendarRepository.findAndCount({
        where: { id_family },
        relations: ['categoryEvent'],
        order: { created_at: 'DESC' },
      });
      return {
        message: 'Success',
        data: data,
        total: total,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getEventOnDate(id_user: string, dto: any) {
    try {
      const { id_family, date } = dto;
      const dateStart = new Date(date);
      const dateEnd = new Date(date);
      dateEnd.setHours(23, 59, 59);
      const data = await this.calendarRepository.find({
        where: {
          id_family,
          time_start: And(MoreThanOrEqual(dateStart), LessThanOrEqual(dateEnd)),
        },
        relations: ['categoryEvent'],
      });
      return {
        message: 'Success',
        data: data,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getCalendarDetail(
    id_user: string,
    id_calendar: number,
    id_family: number,
  ) {
    try {
      const data = await this.calendarRepository.findOne({
        where: { id_calendar, id_family },
        relations: ['categoryEvent'],
      });
      if (!data) {
        throw new RpcException({
          message: 'Calendar event not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return {
        message: 'Success',
        data: data,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async createCalendar(id_user: string, dto: any) {
    try {
      const {
        title,
        description,
        id_family,
        time_start,
        time_end,
        color,
        is_all_day,
        category,
        location,
        recurrence_exception,
        recurrence_id,
        recurrence_rule,
        start_timezone,
        end_timezone,
      } = dto;
      const newCalendar = this.calendarRepository.create({
        title,
        description,
        id_family,
        time_start,
        time_end,
        color,
        is_all_day,
        category,
        location,
        recurrence_exception,
        recurrence_id,
        recurrence_rule,
        start_timezone,
        end_timezone,
      });
      const data = await this.calendarRepository.save(newCalendar);
      return {
        message: 'Success',
        data: data,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateCalendar(id_user: string, dto: any) {
    try {
      const {
        id_calendar,
        id_family,
        title,
        description,
        time_start,
        time_end,
        color,
        is_all_day,
        category,
        location,
        recurrence_exception,
        recurrence_id,
        recurrence_rule,
        start_timezone,
        end_timezone,
      } = dto;
      const calendar = await this.calendarRepository.findOne({
        where: { id_calendar, id_family },
      });
      if (!calendar) {
        throw new RpcException({
          message: 'Calendar event not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      if (title) calendar.title = title;
      if (description) calendar.description = description;
      if (time_start) calendar.time_start = time_start;
      if (time_end) calendar.time_end = time_end;
      if (color) calendar.color = color;
      if (is_all_day !== undefined) calendar.is_all_day = is_all_day;
      if (category) calendar.category = category;
      if (location) calendar.location = location;
      if (recurrence_exception)
        calendar.recurrence_exception = recurrence_exception;
      if (recurrence_id) calendar.recurrence_id = recurrence_id;
      if (recurrence_rule) calendar.recurrence_rule = recurrence_rule;
      if (start_timezone) calendar.start_timezone = start_timezone;
      if (end_timezone) calendar.end_timezone = end_timezone;
      const data = await this.calendarRepository.save(calendar);
      return {
        message: 'Success',
        data: data,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteCalendar(
    id_user: string,
    id_calendar: number,
    id_family: number,
  ) {
    try {
      const calendar = await this.calendarRepository.findOne({
        where: { id_calendar, id_family },
      });
      if (!calendar) {
        throw new RpcException({
          message: 'Calendar event not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      await this.calendarRepository.remove(calendar);
      return {
        message: 'Success',
        data: calendar,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
