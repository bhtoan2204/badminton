import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./user.service";
import { DatabaseModule, RmqModule, Users } from "@app/common";
import { StorageModule } from "./storage/storage.module";
import { ConfigModule } from "@nestjs/config";
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_USER_QUEUE: Joi.string().required(),
        GRPC_STORAGE_PACKAGE: Joi.string().required(),
        GRPC_STORAGE_PROTO_PATH: Joi.string().required(),
        GRPC_STORAGE_URL: Joi.string().required(),
      }),
      envFilePath: process.env.NODE_ENV === 'production' ? './apps/user/.env.production' : './apps/user/.env',
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([Users]),
    RmqModule,
    StorageModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule { }