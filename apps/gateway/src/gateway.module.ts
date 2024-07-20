import { DynamicModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthApiModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { FamilyModule } from './family/family.module';
import { AdminModule } from './admin/admin.module';
import { ChatModule } from './chat/chat.module';
import { CrawlerModule } from './crawler/crawler.module';
import { CalendarModule } from './calendar/calendar.module';
import { UserModule } from './user/user.module';
import { GuidelineModule } from './guideline/guideline.module';
import {
  AppLoggerMiddleware,
  AUTH_SERVICE,
  BACKGROUND_SERVICE,
  CALENDAR_SERVICE,
  CHAT_SERVICE,
  EDUCATION_SERVICE,
  ELASTICSEARCH_SERVICE,
  FAMILY_SERVICE,
  FINANCE_SERVICE,
  GUIDELINE_SERVICE,
  HOUSEHOLD_SERVICE,
  INVOICE_SERVICE,
  PAYMENT_SERVICE,
  PermissionGuard,
  ROLE_SERVICE,
  SHOPPING_SERVICE,
} from './utils';
import { EducationModule } from './education/education.module';
import { HouseholdModule } from './household/household.module';
import { FinanceModule } from './finance/finance.module';
import { ShoppingModule } from './shopping/shopping.module';
import { MailModule } from './mailer/mailer.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { BullModule } from '@nestjs/bull';
import * as Joi from 'joi';
import { APP_GUARD } from '@nestjs/core';
import { RmqModule, SentryModule } from '@app/common';

const globalModule = (module: DynamicModule) => {
  module.global = true;
  return module;
};
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(8080),
        SESSION_SECRET: Joi.string().required(),

        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
        RABBIT_MQ_PAYMENT_QUEUE: Joi.string().required(),
        RABBIT_MQ_FAMILY_QUEUE: Joi.string().required(),
        RABBIT_MQ_MAILER_QUEUE: Joi.string().required(),
        RABBIT_MQ_CHAT_QUEUE: Joi.string().required(),
        RABBIT_MQ_ROLE_QUEUE: Joi.string().required(),
        RABBIT_MQ_CRAWLER_QUEUE: Joi.string().required(),
        RABBIT_MQ_CALENDAR_QUEUE: Joi.string().required(),
        RABBIT_MQ_GUIDELINE_QUEUE: Joi.string().required(),
        RABBIT_MQ_NOTIFICATION_QUEUE: Joi.string().required(),
        RABBIT_MQ_EDUCATION_QUEUE: Joi.string().required(),
        RABBIT_MQ_ELASTICSEARCH_QUEUE: Joi.string().required(),
        RABBIT_MQ_HOUSEHOLD_QUEUE: Joi.string().required(),
        RABBIT_MQ_FINANCE_QUEUE: Joi.string().required(),
        RABBIT_MQ_SHOPPING_QUEUE: Joi.string().required(),
        RABBIT_MQ_INVOICE_QUEUE: Joi.string().required(),

        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_REDIRECT_URI: Joi.string().required(),

        JWT_SECRET: Joi.string().required(),
        JWT_SECRET_REFRESH: Joi.string().required(),
      }),
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? './apps/gateway/.env.production'
          : './apps/gateway/.env',
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'single',
        url: configService.get<string>('REDIS_URL'),
      }),
      inject: [ConfigService],
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
    globalModule(RmqModule.register({ name: AUTH_SERVICE })),
    globalModule(RmqModule.register({ name: PAYMENT_SERVICE })),
    globalModule(RmqModule.register({ name: FAMILY_SERVICE })),
    globalModule(RmqModule.register({ name: CHAT_SERVICE })),
    globalModule(RmqModule.register({ name: ROLE_SERVICE })),
    globalModule(RmqModule.register({ name: CALENDAR_SERVICE })),
    globalModule(RmqModule.register({ name: GUIDELINE_SERVICE })),
    globalModule(RmqModule.register({ name: EDUCATION_SERVICE })),
    globalModule(RmqModule.register({ name: ELASTICSEARCH_SERVICE })),
    globalModule(RmqModule.register({ name: HOUSEHOLD_SERVICE })),
    globalModule(RmqModule.register({ name: FINANCE_SERVICE })),
    globalModule(RmqModule.register({ name: SHOPPING_SERVICE })),
    globalModule(RmqModule.register({ name: INVOICE_SERVICE })),
    globalModule(RmqModule.register({ name: BACKGROUND_SERVICE })),
    globalModule(
      BullModule.registerQueue({
        name: 'notifications',
      }),
    ),
    globalModule(
      BullModule.registerQueue({
        name: 'auth',
      }),
    ),
    ...(process.env.NODE_ENV === 'production' ? [SentryModule] : []),
    AuthApiModule,
    UserModule,
    PaymentModule,
    MailModule,
    FamilyModule,
    ChatModule,
    CrawlerModule,
    CalendarModule,
    GuidelineModule,
    EducationModule,
    HouseholdModule,
    FinanceModule,
    ShoppingModule,
    AdminModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class GatewayModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
