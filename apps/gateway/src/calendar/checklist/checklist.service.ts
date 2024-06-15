import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CALENDAR_SERVICE } from '../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';

@Injectable()
export class ChecklistService {
  constructor(
    @Inject(CALENDAR_SERVICE) private readonly calendarClient: ClientProxy,
  ) {}

  async getAllChecklist(
    id_user: string,
    id_family: number,
    page: number,
    itemsPerPage: number,
  ) {
    try {
      const response = this.calendarClient
        .send('calendarClient/getAllChecklist', {
          id_user,
          id_family,
          page,
          itemsPerPage,
        })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async createChecklist(id_user: string, dto: any) {
    try {
      const response = this.calendarClient
        .send('calendarClient/createChecklist', { id_user, dto })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async updateChecklist(id_user: string, dto: any) {
    try {
      const response = this.calendarClient
        .send('calendarClient/updateChecklist', { id_user, dto })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async deleteChecklist(
    id_user: string,
    id_checklist: number,
    id_family: number,
  ) {
    try {
      const response = this.calendarClient
        .send('calendarClient/deleteChecklist', {
          id_user,
          id_checklist,
          id_family,
        })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}
