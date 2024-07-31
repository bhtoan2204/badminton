import { Article, ArticleCategory, Enclosure } from '@app/common';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import * as Parser from 'rss-parser';
import { Repository } from 'typeorm';

const category = [
  'home',
  'health',
  'world',
  'life',
  'news',
  'business',
  'startup',
  'entertainment',
  'sports',
  'law',
  'education',
  'newest',
  'featured',
  'travel',
  'science',
  'digital',
  'car',
  'opinion',
  'confide',
  'funny',
  'mostviewed',
];

@Injectable()
@Processor('crawler-queue')
export class RssService implements OnModuleInit {
  private readonly rssParser: Parser;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(ArticleCategory)
    private readonly articleCategoryRepository: Repository<ArticleCategory>,
    @InjectRepository(Enclosure)
    private readonly enclosureRepository: Repository<Enclosure>,
    @InjectQueue('crawler-queue') private readonly crawlerQueue: Queue,
  ) {
    this.rssParser = new Parser();
  }

  async getCategoriesNews() {
    try {
      const data = await this.articleCategoryRepository.find();
      return {
        data,
        message: 'Categories retrieved successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getArticles(
    id_article_category: number,
    page: number,
    itemsPerPages: number,
  ) {
    try {
      const [data, count] = await this.articleRepository.findAndCount({
        where: { id_article_category },
        take: itemsPerPages,
        skip: (page - 1) * itemsPerPages,
        relations: ['category', 'enclosure'],
        order: { pubDate: 'DESC' },
      });
      return {
        data,
        count,
        message: 'Articles retrieved successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async onModuleInit() {
    await this.crawlerQueue.add(
      'crawl-articles',
      {},
      { repeat: { cron: '0 2 * * *' } },
    );
  }

  async saveArticle(articleData: any, type: string) {
    try {
      const existingArticle = await this.articleRepository.findOne({
        where: { guid: articleData.guid },
      });

      if (existingArticle) {
        return;
      }

      const category = await this.articleCategoryRepository.findOne({
        where: { name: type },
      });
      if (!category) {
        return;
      }

      let enclosure: Enclosure = null;
      if (articleData.enclosure) {
        enclosure = new Enclosure();
        enclosure.type = articleData.enclosure.type;
        enclosure.length = articleData.enclosure.length;
        enclosure.url = articleData.enclosure.url;
        await this.enclosureRepository.save(enclosure);
      }

      const article = new Article();
      article.title = articleData.title;
      article.link = articleData.link;
      article.content = articleData.content;
      article.contentSnippet = articleData.contentSnippet;
      article.guid = articleData.guid;
      article.isoDate = articleData.isoDate;
      article.pubDate = new Date(articleData.isoDate);
      article.enclosure = enclosure;
      article.category = category;

      await this.articleRepository.save(article);
    } catch (error) {
      // console.log(error);
    }
  }

  async crawlRss(type: string) {
    const feed = await this.rssParser.parseURL(
      this.configService.get<string>(`VNEXPRESS_RSS_${type.toUpperCase()}`),
    );
    return feed;
  }

  @Process('crawl-articles')
  async getRssData() {
    for (const type of category) {
      const feed = await this.crawlRss(type);

      const itemsToProcess = feed.items.slice(0, 10);

      for (const item of itemsToProcess) {
        await this.saveArticle(item, type);

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }
}
