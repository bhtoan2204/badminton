import { Module, forwardRef } from '@nestjs/common';
import { HouseholdController } from './household.controller';
import { HouseholdService } from './household.service';
import { DatabaseModule, RmqModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { StorageModule } from './storage/storage.module';
import * as Joi from 'joi';
import { RoomModule } from './room/room.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_HOUSEHOLD_QUEUE: Joi.string().required(),
      }),
      envFilePath: process.env.NODE_ENV === 'production' ? './apps/household/.env.production' : './apps/household/.env',
    }),
    RmqModule,
    DatabaseModule,
    StorageModule,
    forwardRef(() => RoomModule)
  ],
  controllers: [HouseholdController],
  providers: [HouseholdService],
  exports: [RmqModule]
})
export class HouseholdModule {}
