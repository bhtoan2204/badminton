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

  async getAllCalendar(id_user: string) {
    try {

    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getCalendarDetail() {
    try {
      
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

  async updateCalendar() {
    try {

    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async deleteCalendar() {
    try {

    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }
}
