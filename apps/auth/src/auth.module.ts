import { Module } from '@nestjs/common';
import { RmqModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './auth/authentication.module';
import * as Joi from 'joi';
import { DatabaseModule } from '@app/common/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/auth/.env'
    }),
    DatabaseModule,
    AuthenticationModule,
    RmqModule
  ],
})
export class AuthModule { }
