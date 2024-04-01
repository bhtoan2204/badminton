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
          DATABASE_URL: Joi.string().required()
        }),
        envFilePath: './libs/.env'
      }),
      TypeOrmModule.forRootAsync({
        imports : [ConfigModule],
        useFactory: (configService: ConfigService) => {
          const dbUrl = configService.get('DATABASE_URL');
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
            ssl: true
          }
        },
        inject: [ConfigService]
      }),
    ],
})
export class DatabaseModule {}