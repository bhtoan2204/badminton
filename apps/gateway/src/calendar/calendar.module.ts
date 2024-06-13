import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { CALENDAR_SERVICE, FAMILY_SERVICE, PermissionGuard } from '../utils';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    RmqModule.register({ name: CALENDAR_SERVICE }),
    RmqModule.register({ name: FAMILY_SERVICE }),
  ],
  controllers: [CalendarController],
  providers: [
    CalendarService,
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class CalendarModule {}
