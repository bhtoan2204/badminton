import {
  CalendarResponse,
  CalendarServiceController,
  CalendarServiceControllerMethods,
  CreateDefaultChecklistTypeRequest,
  FindCalendarByFrequencyRequest,
  FindCalendarByFrequencyResponse,
  FindNonRepeatCalendarResponse,
  FindOneByIdRequest,
} from '@app/common';
import { Controller } from '@nestjs/common';
import { Observable } from 'rxjs';
import { GrpcCalendarService } from './grpc-calendar.service';
import { Empty } from '@app/common';

@Controller()
@CalendarServiceControllerMethods()
export class GrpcCalendarController implements CalendarServiceController {
  constructor(private readonly grpcCalendarService: GrpcCalendarService) {}

  createDefaultChecklistType(
    request: CreateDefaultChecklistTypeRequest,
  ): Promise<Empty> | Observable<Empty> | Empty {
    return this.createDefaultChecklistType(request);
  }

  findCalendarByFrequency(
    request: FindCalendarByFrequencyRequest,
  ):
    | Promise<FindCalendarByFrequencyResponse>
    | Observable<FindCalendarByFrequencyResponse>
    | FindCalendarByFrequencyResponse {
    return this.grpcCalendarService.findCalendarByFrequency(request);
  }

  findOneById(
    request: FindOneByIdRequest,
  ):
    | Promise<CalendarResponse>
    | Observable<CalendarResponse>
    | CalendarResponse {
    return this.grpcCalendarService.findCalendarById(request);
  }

  findNonRepeatCalendar(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request: Empty,
  ):
    | Promise<FindNonRepeatCalendarResponse>
    | Observable<FindNonRepeatCalendarResponse>
    | FindNonRepeatCalendarResponse {
    return this.grpcCalendarService.findNonRepeatCalendar();
  }
}
