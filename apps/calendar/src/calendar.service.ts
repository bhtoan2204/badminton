import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { EntityManager } from 'typeorm';

@Injectable()
export class CalendarService {
  constructor(
    private readonly configService: ConfigService,
    private readonly entityManager: EntityManager
  ) { }

  async getAllCalendar(id_user: string, id_family: number) {
    try {
      const query = 'SELECT * FROM f_get_calendar_events($1, $2)';
      const params = [id_user, id_family];
      const data = await this.entityManager.query(query, params);
      return {
        message: 'Success',
        data: data
      };
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  };

  async getEventOnDate(id_user: string, dto) {
    try {
      const { id_family, date } = dto;
      const dateStart = new Date(date);
      const dateEnd = new Date(date);
      dateEnd.setHours(23, 59, 59);
      const query = 'SELECT * FROM f_get_events_for_family($1, $2, $3, $4)';
      const params = [id_user, id_family, dateStart.toISOString(), dateEnd.toISOString()];
      const data = await this.entityManager.query(query, params);
      return {
        message: 'Success',
        data: data
      };
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getCalendarDetail(id_user: string, id_calendar: number) {
    try {
      const query = 'SELECT * FROM f_get_calendar_detail($1, $2)';
      const params = [id_user, id_calendar];
      const data = await this.entityManager.query(query, params);
      return {
        message: 'Success',
        data: data
      };
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async createCalendar(id_user: string, dto: any) {
    try {
      const { title, description, id_family, time_start, time_end, color, is_all_day } = dto;
      const query = 'SELECT * FROM f_create_calendar_event($1, $2, $3, $4, $5, $6, $7, $8)';
      const params = [id_user, id_family, title, description, time_start, time_end, color, is_all_day];
      const data = await this.entityManager.query(query, params);
      return {
        message: 'Success',
        data: {
          id_calendar: data[0].f_create_calendar_event,
          title, description, id_family, time_start, time_end, color, is_all_day
        }
      };
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async updateCalendar(id_user: string, dto: any) {
    try {
      const { id_calendar, title, description, time_start, time_end, color, is_all_day } = dto;
      const query = 'SELECT * FROM f_update_calendar_event($1, $2, $3, $4, $5, $6, $7, $8)';
      const params = [id_user, id_calendar, title, description, time_start, time_end, color, is_all_day];
      const data = await this.entityManager.query(query, params);
      return {
        message: 'Success',
        data: data
      };
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async deleteCalendar(id_user: string, id_calendar: number) {
    try {
      const query = 'SELECT * FROM f_delete_calendar_event($1, $2)';
      const params = [id_user, id_calendar];
      const data = await this.entityManager.query(query, params);
      return {
        message: 'Success',
        data: data
      };
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }
}
