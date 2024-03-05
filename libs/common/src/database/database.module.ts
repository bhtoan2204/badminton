import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { parse } from "pg-connection-string";
import * as Joi from 'joi';

@Module({
    imports: [
      ConfigModule.forRoot({
        isGlobal: false,
        validationSchema: Joi.object({
          DB_USERNAME: Joi.string().required(),
          DB_PASSWORD: Joi.string().required(),
          DB_HOST: Joi.string().required(),
          DB_PORT: Joi.number().required(),
          DB_DATABASE: Joi.string().required()
        }),
        envFilePath: './libs/.env'
      }),
      TypeOrmModule.forRootAsync({
        imports : [ConfigModule],
        useFactory: (configService: ConfigService) => {
          const username = configService.get('DB_USERNAME');
          const password = configService.get('DB_PASSWORD');
          const host = configService.get('DB_HOST');
          const port = configService.get('DB_PORT');
          const database = configService.get('DB_DATABASE');
          
          return {
            type: 'postgres',
            host: host,
            port: port,
            username: username,
            password: password,
            database: database,
            synchronize: true,
            autoLoadEntities: true,
            ssl: true
          }
        },
        inject: [ConfigService]
      }),
    ],
})
export class DatabaseModule {}
