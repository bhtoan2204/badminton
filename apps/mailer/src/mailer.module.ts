import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailController } from './mailer.controller';
import { MailService } from './mailer.service';
import { DatabaseModule, RmqModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as Joi from 'joi';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MAIL_HOST: Joi.string().required(),
        MAIL_PORT: Joi.number().required(),
        MAIL_USER: Joi.string().required(),
        MAIL_PASSWORD: Joi.string().required(),
        MAIL_SENDER: Joi.string().required(),
      }),
      envFilePath: process.env.NODE_ENV === 'production' ? './apps/mailer/.env.production' : './apps/mailer/.env',
    }),
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: configService.get<number>('MAIL_PORT'),
          secure: false,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${configService.get<string>('MAIL_SENDER')}>`,
        },
        template: {
          dir: join(__dirname, '..', 'templates/'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    RmqModule,
    DatabaseModule
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule { }
