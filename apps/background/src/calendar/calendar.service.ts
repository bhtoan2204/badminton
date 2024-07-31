import {
  CALENDAR_SERVICE_NAME,
  CalendarResponse,
  CalendarServiceClient,
  FindCalendarByFrequencyRequest,
  FindCalendarByFrequencyResponse,
  FindOneByIdRequest,
} from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CalendarService implements OnModuleInit {
  private calendarService: CalendarServiceClient;
  constructor(@Inject('CALENDAR') private calendarClient: ClientGrpc) {}

  onModuleInit() {
    this.calendarService =
      this.calendarClient.getService<CalendarServiceClient>(
        CALENDAR_SERVICE_NAME,
      );
  }

  async findCalendarByFrequency(
    request: FindCalendarByFrequencyRequest,
  ): Promise<FindCalendarByFrequencyResponse> {
    try {
      return await lastValueFrom(
        this.calendarService.findCalendarByFrequency(request),
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async findCalendarById(req: FindOneByIdRequest): Promise<CalendarResponse> {
    try {
      return await lastValueFrom(this.calendarService.findOneById(req));
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
