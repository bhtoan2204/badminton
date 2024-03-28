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
  }

  async getCalendarDetail(id_user: string, id_calendar: number) {
    try {
      const query = 'SELECT * FROM f_get_calendar_event_by_calendar($1, $2)';
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
      const query = 'SELECT * FROM f_insert_calendar_event($1, $2, $3, $4, $5)';
      const params = [id_user, dto.id_family, dto.title, dto.description, dto.datetime];
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

  async updateCalendar(id_user: string, dto: any) {
    try {
      const query = 'SELECT * FROM f_update_calendar_event($1, $2, $3, $4, $5)';
      const params = [id_user, dto.id_calendar, dto.title, dto.description, dto.datetime];
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
