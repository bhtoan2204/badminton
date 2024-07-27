import { DynamicModule, forwardRef, Module } from '@nestjs/common';
import { BackgroundService } from './background.service';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  Calendar,
  Checklist,
  DatabaseModule,
  Family,
  MemberFamily,
  MgDatabaseModule,
  NotificationData,
  NotificationDataSchema,
  RmqModule,
} from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from './notification/notification.module';
import { RssModule } from './rss/rss.module';
import { BankModule } from './bank/bank.module';

const globalModule = (module: DynamicModule) => {
  module.global = true;
  return module;
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({}),
    }),
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
    globalModule(
      BullModule.registerQueue({
        name: 'chats',
      }),
    ),
    globalModule(
      BullModule.registerQueue({
        name: 'cron-queue',
      }),
    ),
    globalModule(
      BullModule.registerQueue({
        name: 'notifications',
      }),
    ),
    globalModule(
      BullModule.registerQueue({
        name: 'crawler-queue',
      }),
    ),
    MgDatabaseModule,
    MongooseModule.forFeature([
      { name: NotificationData.name, schema: NotificationDataSchema },
    ]),
    RmqModule,
    DatabaseModule,
    TypeOrmModule.forFeature([Family, MemberFamily, Checklist, Calendar]),
    forwardRef(() => NotificationModule),
    forwardRef(() => RssModule),
    forwardRef(() => BankModule),
  ],
  providers: [BackgroundService],
  exports: [RmqModule],
})
export class BackgroundModule {}
