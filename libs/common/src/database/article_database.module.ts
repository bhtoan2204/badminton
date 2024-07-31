import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { parse } from 'pg-connection-string';
import * as Joi from 'joi';
import { Article } from './entity/article/article.entity';
import { ArticleCategory } from './entity/article/article_category.entity';
import { Enclosure } from './entity/article/enclosure.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: false,
      validationSchema: Joi.object({
        ARTICLE_DATABASE_URL: Joi.string().required(),
      }),
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? './libs/.env.production'
          : './libs/.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get('ARTICLE_DATABASE_URL');
        const connectionOptions = parse(dbUrl);
        return {
          name: 'article',
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
          entities: [Article, ArticleCategory, Enclosure],
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class ArticleDatabaseModule {}
