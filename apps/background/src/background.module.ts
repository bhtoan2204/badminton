import { DynamicModule, Module } from '@nestjs/common';
import { BackgroundService } from './background.service';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  Article,
  ArticleCategory,
  ArticleDatabaseModule,
  Enclosure,
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
import { UserModule } from './user/user.module';
import { FamilyModule } from './family/family.module';
import { CalendarModule } from './calendar/calendar.module';

const globalModule = (module: DynamicModule) => {
  module.global = true;
  return module;
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        GRPC_FAMILY_PACKAGE: Joi.string().required(),
        GRPC_FAMILY_PROTO_PATH: Joi.string().required(),
        GRPC_FAMILY_URL: Joi.string().required(),

        GRPC_USER_PACKAGE: Joi.string().required(),
        GRPC_USER_PROTO_PATH: Joi.string().required(),
        GRPC_USER_URL: Joi.string().required(),

        GRPC_CALENDAR_PACKAGE: Joi.string().required(),
        GRPC_CALENDAR_PROTO_PATH: Joi.string().required(),
        GRPC_CALENDAR_URL: Joi.string().required(),

        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        RABBIT_MQ_URI: Joi.string().required(),
      }),
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? './apps/background/.env.production'
          : './apps/background/.env',
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
    ArticleDatabaseModule,
    TypeOrmModule.forFeature([Article, ArticleCategory, Enclosure]),
    NotificationModule,
    RssModule,
    BankModule,
    UserModule,
    FamilyModule,
    CalendarModule,
  ],
  providers: [BackgroundService],
})
export class BackgroundModule {}
