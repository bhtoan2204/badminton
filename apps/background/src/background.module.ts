import { Module } from '@nestjs/common';
import { BackgroundController } from './background.controller';
import { BackgroundService } from './background.service';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { RmqModule } from '@app/common';

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
    BullModule.registerQueue({
      name: 'cron-queue',
    }),
    RmqModule,
  ],
  controllers: [BackgroundController],
  providers: [BackgroundService],
})
export class BackgroundModule {}
