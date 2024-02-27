import { Module } from '@nestjs/common';
import { familyController } from './family.controller';
import { DatabaseModule, Family, RmqModule } from '@app/common';
import { familyService } from './family.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_FAMILY_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/family/.env'
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([Family]),
    RmqModule
  ],
  controllers: [familyController],
  providers: [familyService],
})
export class FamilyModule {}
