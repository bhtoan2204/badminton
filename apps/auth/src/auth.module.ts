import { Module } from '@nestjs/common';
import { RmqModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthenticationModule } from './auth/authentication.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { parse } from 'pg-connection-string';
import { SmsModule } from './sms/sms.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
        TWILIO_ACCOUNT_SID: Joi.string().required(),
        TWILIO_AUTH_TOKEN: Joi.string().required(),
      }),
      envFilePath: './apps/auth/.env'
    }),
    TypeOrmModule.forRootAsync({
      imports : [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get('DATABASE_URL_CLUSTER_1');
        const connectionOptions = parse(dbUrl);
        return {
          type: 'postgres',
          host: connectionOptions.host,
          port: parseInt(connectionOptions.port),
          username: connectionOptions.user,
          password: connectionOptions.password,
          database: connectionOptions.database,
          synchronize: true,
          autoLoadEntities: true,
          ssl: {
            rejectUnauthorized: false
          }
        }
      },
      inject: [ConfigService]
    }),
    AuthenticationModule,
    RmqModule,
    SmsModule
  ],
})
export class AuthModule { }
