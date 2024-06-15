import { Module } from '@nestjs/common';
import {
  Checklist,
  Family,
  FirebaseService,
  GlobalJwtModule,
  RmqModule,
  Users,
} from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/common/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
      }),
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? './apps/auth/.env.production'
          : './apps/auth/.env',
    }),
    DatabaseModule,
    AuthModule,
    RmqModule,
    TypeOrmModule.forFeature([Users, Family, Checklist]),
    GlobalJwtModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, FirebaseService],
})
export class AuthModule {}
