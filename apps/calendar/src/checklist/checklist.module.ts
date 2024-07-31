import { Module } from '@nestjs/common';
import { ChecklistController } from './checklist.controller';
import { ChecklistService } from './checklist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CalendarDatabaseModule,
  Checklist,
  ChecklistType,
  RmqModule,
} from '@app/common';

@Module({
  imports: [
    CalendarDatabaseModule,
    RmqModule,
    TypeOrmModule.forFeature([Checklist, ChecklistType]),
  ],
  controllers: [ChecklistController],
  providers: [ChecklistService],
})
export class ChecklistModule {}
