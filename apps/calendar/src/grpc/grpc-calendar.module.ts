import {
  Calendar,
  CalendarDatabaseModule,
  CategoryEvent,
  ChecklistType,
  GrpcModule,
} from '@app/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrpcCalendarController } from './grpc-calendar.controller';
import { GrpcCalendarService } from './grpc-calendar.service';
import { BackgroundCalendarService } from './grpc-calendar.process';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    GrpcModule,
    CalendarDatabaseModule,
    TypeOrmModule.forFeature([Calendar, CategoryEvent, ChecklistType]),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'default-checklist-queue',
    }),
  ],
  controllers: [GrpcCalendarController],
  providers: [GrpcCalendarService, BackgroundCalendarService],
})
export class GrpcCalendarModule {}
