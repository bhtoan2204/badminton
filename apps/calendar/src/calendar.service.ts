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
  async getAllCategoryEvent(id_user: string, id_family: number) {
    try {
      const query = 'SELECT * FROM get_all_category_events($1, $2)';
      const params = [id_family, id_user];
      const data = await this.entityManager.query(query, params);
      return data;
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  };

  async createCategoryEvent(id_user: string, dto: any) {
    try {
      const { title, color, id_family } = dto 
      const query = 'SELECT * FROM create_category_event($1, $2, $3, $4)';
      const params = [title, color, id_family, id_user];
      const data = await this.entityManager.query(query, params);
      return data;
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  };
  async updateCategoryEvent(id_user: string, dto: any) {
    try {
      const {id_category_event, title, color, id_family } = dto 

      const query = 'SELECT * FROM update_category_event($1, $2, $3, $4, $5)';
      const params = [id_category_event, title, color, id_family, id_user];
      const data = await this.entityManager.query(query, params);
      return data;
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  };
  async deleteCategoryEvent(id_user: string, id_category_event: number) {
    try {
      const query = 'SELECT * FROM delete_category_event($1, $2)';
      const params = [id_category_event, id_user];
      const data = await this.entityManager.query(query, params);
      return data;
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  };




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
      const { title, description, id_family, time_start, time_end, color, is_all_day, category, location, recurrence_exception, recurrence_id, recurrence_rule, start_timezone, end_timezone } = dto;
      const query = 'SELECT * FROM f_create_calendar_event($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)';
      const params = [id_user, id_family, title, description, time_start, time_end, color, is_all_day, category, location, recurrence_exception, recurrence_id, recurrence_rule, start_timezone, end_timezone];
      const data = await this.entityManager.query(query, params);
      return {
        message: 'Success',
        data: {
          id_calendar: data[0].f_create_calendar_event,
          title, description, id_family, time_start, time_end, color, is_all_day, category, location, recurrence_exception, recurrence_id, recurrence_rule, start_timezone, end_timezone
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
      const { id_calendar, title, description, time_start, time_end, color, is_all_day, category, location, recurrence_exception, recurrence_id, recurrence_rule, start_timezone, end_timezone } = dto;
      const query = 'SELECT * FROM f_update_calendar_event($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)';
      const params = [id_user, id_calendar, title, description, time_start, time_end, color, is_all_day, category, location, recurrence_exception, recurrence_id, recurrence_rule, start_timezone, end_timezone];
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
