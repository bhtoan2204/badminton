import { Module } from '@nestjs/common';
import { FilesModule } from './files/files.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        GRPC_STORAGE_PACKAGE: Joi.string().required(),
        GRPC_STORAGE_PROTO_PATH: Joi.string().required(),
      }),
      envFilePath: process.env.NODE_ENV === 'production' ? './apps/storage/.env.production' : './apps/storage/.env',
    }),
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class StorageModule {}
