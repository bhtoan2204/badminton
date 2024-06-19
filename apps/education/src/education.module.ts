import { Module } from '@nestjs/common';
import { EducationController } from './education.controller';
import { EducationService } from './education.service';
import {
  DatabaseModule,
  EducationProgress,
  RmqModule,
  Subjects,
} from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_EDUCATION_QUEUE: Joi.string().required(),
      }),
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? './apps/education/.env.production'
          : './apps/education/.env',
    }),
    RmqModule,
    DatabaseModule,
    TypeOrmModule.forFeature([EducationProgress, Subjects]),
  ],
  controllers: [EducationController],
  providers: [EducationService],
})
export class EducationModule {}
