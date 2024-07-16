import { Injectable, HttpException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { BACKGROUND_SERVICE } from '../utils';
import { ClientProxy } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Injectable()
export class CrawlerService {
  constructor(
    @Inject(BACKGROUND_SERVICE) private crawlerClient: ClientProxy,
    private readonly rmqService: RmqService,
  ) {}

  async getCategoriesNews() {
    try {
      return await this.rmqService.send(
        this.crawlerClient,
        'crawlerClient/getCategoriesNews',
        {},
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getRssData(
    id_article_category: number,
    page: number,
    itemsPerPage: number,
  ) {
    try {
      return await this.rmqService.send(
        this.crawlerClient,
        'crawlerClient/getNews',
        {
          id_article_category,
          page,
          itemsPerPage,
        },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async scrapeInterestRatesLocalBank() {
    try {
      return await this.rmqService.send(
        this.crawlerClient,
        'crawlerClient/scrapeInterestRatesLocalBank',
        {},
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }
}
