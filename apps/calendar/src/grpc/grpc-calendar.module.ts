import {
  Calendar,
  CalendarDatabaseModule,
  CategoryEvent,
  GrpcModule,
} from '@app/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrpcCalendarController } from './grpc-calendar.controller';
import { GrpcCalendarService } from './grpc-calendar.service';

@Module({
  imports: [
    GrpcModule,
    CalendarDatabaseModule,
    TypeOrmModule.forFeature([Calendar, CategoryEvent]),
  ],
  controllers: [GrpcCalendarController],
  providers: [GrpcCalendarService],
})
export class GrpcCalendarModule {}
