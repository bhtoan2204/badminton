import { forwardRef, Module } from '@nestjs/common';
import { ChecklistTypeController } from './checklistType.controller';
import { ChecklistTypeService } from './checklistType.service';
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
  controllers: [ChecklistTypeController],
  providers: [ChecklistTypeService],
  exports: [ChecklistTypeService],
})
export class ChecklistTypeModule {}
