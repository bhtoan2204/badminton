import { forwardRef, Module } from '@nestjs/common';
import { CalendarModule } from '../calendar.module';
import { ChecklistController } from './checklist.controller';
import { ChecklistService } from './checklist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Checklist, ChecklistType } from '@app/common';

@Module({
  imports: [
    forwardRef(() => CalendarModule),
    TypeOrmModule.forFeature([Checklist]),
  ],
  controllers: [ChecklistController, ChecklistType],
  providers: [ChecklistService],
})
export class ChecklistModule {}
