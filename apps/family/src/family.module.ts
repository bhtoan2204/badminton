import { Module } from '@nestjs/common';
import { FamilyController } from './family.controller';
import {
  MainDatabaseModule,
  Family,
  FamilyExtraPackages,
  FamilyRoles,
  MemberFamily,
  PackageExtra,
  RmqModule,
  Users,
} from '@app/common';
import { FamilyService } from './family.service';
import { ConfigModule } from '@nestjs/config';
import { StorageModule } from './storage/storage.module';
import * as Joi from 'joi';
import { InvitationModule } from './invitation/invitation.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyGrpcModule } from './grpc/family-grpc.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_FAMILY_QUEUE: Joi.string().required(),

        GRPC_FAMILY_PACKAGE: Joi.string().required(),
        GRPC_FAMILY_PROTO_PATH: Joi.string().required(),
        GRPC_FAMILY_URL: Joi.string().required(),
      }),
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? './apps/family/.env.production'
          : './apps/family/.env',
    }),
    MainDatabaseModule,
    RmqModule,
    StorageModule,
    InvitationModule,
    TypeOrmModule.forFeature([
      Family,
      PackageExtra,
      FamilyExtraPackages,
      MemberFamily,
      FamilyRoles,
      Users,
    ]),
    FamilyGrpcModule,
  ],
  controllers: [FamilyController],
  providers: [FamilyService],
})
export class FamilyModule {}
