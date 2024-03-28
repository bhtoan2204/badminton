import { Module } from '@nestjs/common';
import { GuidelineController } from './guideline.controller';
import { GuidelineService } from './guideline.service';
import { DatabaseModule, RmqModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_GUIDELINE_QUEUE: Joi.string().required(),
      }),
      envFilePath: process.env.NODE_ENV === 'production' ? './apps/guideline/.env.production' : './apps/guideline/.env',
    }),
    RmqModule,
    DatabaseModule,
  ],
  controllers: [GuidelineController],
  providers: [GuidelineService],
})
export class GuidelineModule {}
