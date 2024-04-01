import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RmqModule, DatabaseModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_ROLE_QUEUE: Joi.string().required(),
      }),
      envFilePath: process.env.NODE_ENV === 'production' ? './apps/role/.env.production' : './apps/role/.env',
    }),
    RmqModule,
    DatabaseModule

  ],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule { }
