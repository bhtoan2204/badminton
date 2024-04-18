import { Module } from '@nestjs/common';
import { FamilyController } from './family.controller';
import { DatabaseModule, RmqModule } from '@app/common';
import { FamilyService } from './family.service';
import { ConfigModule } from '@nestjs/config';
import { StorageModule } from './storage/storage.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_FAMILY_QUEUE: Joi.string().required(),
      }),
      envFilePath: process.env.NODE_ENV === 'production' ? './apps/family/.env.production' : './apps/family/.env',
    }),
    DatabaseModule,
    RmqModule,
    StorageModule
  ],
  controllers: [FamilyController],
  providers: [FamilyService],
})
export class FamilyModule { }
