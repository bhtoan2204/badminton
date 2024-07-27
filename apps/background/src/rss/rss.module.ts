import { Module, forwardRef } from '@nestjs/common';
import { RssController } from './rss.controller';
import { RssService } from './rss.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Article,
  ArticleCategory,
  DatabaseModule,
  Enclosure,
} from '@app/common';
import { BackgroundModule } from '../background.module';

@Module({
  imports: [
    forwardRef(() => BackgroundModule),
    DatabaseModule,
    TypeOrmModule.forFeature([Article, ArticleCategory, Enclosure]),
  ],
  controllers: [RssController],
  providers: [RssService],
})
export class RssModule {}
