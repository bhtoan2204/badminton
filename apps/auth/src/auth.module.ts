import { Module } from '@nestjs/common';
import {
  FirebaseService,
  GlobalJwtModule,
  RefreshToken,
  RmqModule,
  Users,
} from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { MainDatabaseModule } from '@app/common/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import * as Joi from 'joi';
import { UserModule } from './user/user.module';
import { RefreshTokenModule } from './refreshToken/refreshToken.module';
import { UserGrpcModule } from './grpc/user-grpc.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),

        GRPC_STORAGE_PACKAGE: Joi.string().required(),
        GRPC_STORAGE_PROTO_PATH: Joi.string().required(),
        GRPC_STORAGE_URL: Joi.string().required(),

        MAIL_HOST: Joi.string().required(),
        MAIL_PORT: Joi.number().required(),
        MAIL_USER: Joi.string().required(),
        MAIL_PASSWORD: Joi.string().required(),
        MAIL_SENDER: Joi.string().required(),
      }),
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? './apps/auth/.env.production'
          : './apps/auth/.env',
    }),
    MainDatabaseModule,
    AuthModule,
    RefreshTokenModule,
    RmqModule,
    TypeOrmModule.forFeature([Users, RefreshToken]),
    GlobalJwtModule,
    UserModule,
    UserGrpcModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, FirebaseService],
})
export class AuthModule {}
