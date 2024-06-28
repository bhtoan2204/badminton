import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CRAWLER_SERVICE } from '../utils';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';

@Injectable()
export class CrawlerService {
  constructor(@Inject(CRAWLER_SERVICE) private crawlerClient: ClientProxy) {}

  async getCategoriesNews() {
    try {
      const response = this.crawlerClient
        .send('crawlerClient/getCategoriesNews', {})
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getRssData(
    id_article_category: number,
    page: number,
    itemsPerPage: number,
  ) {
    try {
      const response = this.crawlerClient
        .send('crawlerClient/getNews', {
          id_article_category,
          page,
          itemsPerPage,
        })
        .pipe(timeout(15000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async scrapeInterestRatesLocalBank() {
    try {
      const response = this.crawlerClient
        .send('crawlerClient/scrapeInterestRatesLocalBank', {})
        .pipe(timeout(20000));
      return await lastValueFrom(response);
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}
