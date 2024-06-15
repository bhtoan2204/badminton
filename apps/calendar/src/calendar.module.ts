import { forwardRef, Module } from '@nestjs/common';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { DatabaseModule, RmqModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { ChecklistModule } from './checklist/checklist.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_CALENDAR_QUEUE: Joi.string().required(),
      }),
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? './apps/calendar/.env.production'
          : './apps/calendar/.env',
    }),
    RmqModule,
    DatabaseModule,
    forwardRef(() => ChecklistModule),
  ],
  controllers: [CalendarController],
  providers: [CalendarService],
  exports: [RmqModule, DatabaseModule],
})
export class CalendarModule {}
