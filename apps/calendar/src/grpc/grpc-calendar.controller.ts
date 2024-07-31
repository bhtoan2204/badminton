import {
  CalendarResponse,
  CalendarServiceController,
  CalendarServiceControllerMethods,
  FindCalendarByFrequencyRequest,
  FindCalendarByFrequencyResponse,
  FindOneByIdRequest,
} from '@app/common';
import { Controller } from '@nestjs/common';
import { Observable } from 'rxjs';
import { GrpcCalendarService } from './grpc-calendar.service';

@Controller()
@CalendarServiceControllerMethods()
export class GrpcCalendarController implements CalendarServiceController {
  constructor(private readonly grpcCalendarService: GrpcCalendarService) {}

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
}
