import { forwardRef, Module } from '@nestjs/common';
import { CalendarModule } from '../calendar.module';
import { ChecklistController } from './checklist.controller';
import { ChecklistService } from './checklist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Checklist, Family, Users } from '@app/common';

@Module({
  imports: [
    forwardRef(() => CalendarModule),
    TypeOrmModule.forFeature([Checklist, Family, Users]),
  ],
  controllers: [ChecklistController],
  providers: [ChecklistService],
})
export class ChecklistModule {}
