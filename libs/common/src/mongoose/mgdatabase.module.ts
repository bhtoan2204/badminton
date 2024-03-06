import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: false,
      validationSchema: Joi.object({
        MONGOOSE_URL: Joi.string().required()
      }),
      envFilePath: './libs/.env'
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGOOSE_URL'),
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [MgDatabaseModule]
})
export class MgDatabaseModule { }