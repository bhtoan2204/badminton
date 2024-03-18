import { HttpException, Inject, Injectable } from "@nestjs/common";
import { CALENDAR_SERVICE } from "../utils/constant/services.constant";
import { ClientProxy } from "@nestjs/microservices";
import { CreateCalendarDto } from "./dto/createCalendar.dto";
import { lastValueFrom, timeout } from "rxjs";

@Injectable()
export class CalendarService {
  constructor(
    @Inject(CALENDAR_SERVICE) private readonly calendarClient: ClientProxy
  ) { }

  async getAllCalendar(id_user: string) {
    try {

    }
    catch (error) {
      throw new HttpException(error, error.statusCode);
    }
  }

  async getCalendarDetail() {
    try {

    }
    catch (error) {
      throw new HttpException(error, error.statusCode);
    }
  }

  async createCalendar(id_user: string, dto: CreateCalendarDto) {
    try {
      const response = this.calendarClient.send('calendarClient/createCalendar', { id_user, dto })
        .pipe(
          timeout(5000),
        );
      const data = await lastValueFrom(response);
      return data;
    }
    catch (error) {
      throw new HttpException(error, error.statusCode);
    }
  }

  async updateCalendar() {
    try {

    }
    catch (error) {
      throw new HttpException(error, error.statusCode);
    }
  }

  async deleteCalendar() {
    try {

    }
    catch (error) {
      throw new HttpException(error, error.statusCode);
    }
  }

}