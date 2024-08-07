import { forwardRef, Module } from '@nestjs/common';
import { ChecklistController } from './checklist.controller';
import { ChecklistService } from './checklist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CalendarDatabaseModule,
  Checklist,
  ChecklistType,
  RmqModule,
} from '@app/common';
import { CalendarModule } from '../calendar.module';

@Module({
  imports: [
    CalendarDatabaseModule,
    RmqModule,
    TypeOrmModule.forFeature([Checklist, ChecklistType]),
    forwardRef(() => CalendarModule),
  ],
  controllers: [ChecklistController],
  providers: [ChecklistService],
})
export class ChecklistModule {}
