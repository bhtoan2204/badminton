import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { CALENDAR_SERVICE, FAMILY_SERVICE } from '../utils';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';

@Module({
  imports: [
    RmqModule.register({ name: CALENDAR_SERVICE }),
    RmqModule.register({ name: FAMILY_SERVICE }),
  ],
  controllers: [CalendarController],
  providers: [CalendarService],
})
export class CalendarModule {}
