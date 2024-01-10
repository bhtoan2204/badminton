import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: {

      },
      envFilePath: './gateway/.env.development',
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
