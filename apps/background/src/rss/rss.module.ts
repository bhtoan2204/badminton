import { Module } from '@nestjs/common';
import { RssController } from './rss.controller';
import { RssService } from './rss.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Article,
  ArticleCategory,
  ArticleDatabaseModule,
  Enclosure,
  RmqModule,
} from '@app/common';

@Module({
  imports: [
    RmqModule,
    ArticleDatabaseModule,
    TypeOrmModule.forFeature([Article, ArticleCategory, Enclosure]),
  ],
  controllers: [RssController],
  providers: [RssService],
})
export class RssModule {}
