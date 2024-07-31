import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { GrpcModule } from '@app/common';

@Module({
  imports: [GrpcModule.register({ name: 'CALENDAR' })],
  providers: [CalendarService],
  exports: [CalendarService],
})
export class CalendarModule {}
