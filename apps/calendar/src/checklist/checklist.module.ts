import { forwardRef, Module } from '@nestjs/common';
import { CalendarModule } from '../calendar.module';
import { ChecklistController } from './checklist.controller';
import { ChecklistService } from './checklist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Checklist, ChecklistType, DatabaseModule } from '@app/common';

@Module({
  imports: [
    forwardRef(() => CalendarModule),
    DatabaseModule,
    TypeOrmModule.forFeature([Checklist, ChecklistType]),
  ],
  controllers: [ChecklistController, ChecklistType],
  providers: [ChecklistService],
})
export class ChecklistModule {}
