import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { parse } from 'pg-connection-string';
import { EducationProgress } from './entity/education/education_progress.entity';
import { Subjects } from './entity/education/subject.entity';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: false,
      validationSchema: Joi.object({
        EDUCATION_DATABASE_URL: Joi.string().required(),
      }),
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? './libs/.env.production'
          : './libs/.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get('EDUCATION_DATABASE_URL');
        const connectionOptions = parse(dbUrl);
        return {
          name: 'calendar',
          type: 'postgres',
          host: connectionOptions.host,
          port: parseInt(connectionOptions.port),
          username: connectionOptions.user,
          password: connectionOptions.password,
          database: connectionOptions.database,
          synchronize: true,
          autoLoadEntities: true,
          ssl: {
            rejectUnauthorized: false,
          },
          entities: [EducationProgress, Subjects],
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class EducationDatabaseModule {}
