import { RmqModule } from '@app/common';
import { Module, forwardRef } from '@nestjs/common';
import { CALENDAR_SERVICE, FAMILY_SERVICE } from '../utils';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { ChecklistModule } from './checklist/checklist.module';

@Module({
  imports: [
    RmqModule.register({ name: CALENDAR_SERVICE }),
    RmqModule.register({ name: FAMILY_SERVICE }),
    forwardRef(() => ChecklistModule),
  ],
  controllers: [CalendarController],
  providers: [CalendarService],
  exports: [RmqModule],
})
export class CalendarModule {}
