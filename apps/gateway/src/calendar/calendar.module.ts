import { Module, forwardRef } from '@nestjs/common';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { ChecklistModule } from './checklist/checklist.module';

@Module({
  imports: [forwardRef(() => ChecklistModule)],
  controllers: [CalendarController],
  providers: [CalendarService],
})
export class CalendarModule {}
