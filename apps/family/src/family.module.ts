import { Module, forwardRef } from '@nestjs/common';
import { FamilyController } from './family.controller';
import { DatabaseModule, RmqModule } from '@app/common';
import { FamilyService } from './family.service';
import { ConfigModule } from '@nestjs/config';
import { StorageModule } from './storage/storage.module';
import * as Joi from 'joi';
import { InvitationModule } from './invitation/invitation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_FAMILY_QUEUE: Joi.string().required(),
      }),
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? './apps/family/.env.production'
          : './apps/family/.env',
    }),
    DatabaseModule,
    RmqModule,
    StorageModule,
    forwardRef(() => InvitationModule),
  ],
  controllers: [FamilyController],
  providers: [FamilyService],
  exports: [
    RmqModule,
    DatabaseModule
  ]
})
export class FamilyModule {}
