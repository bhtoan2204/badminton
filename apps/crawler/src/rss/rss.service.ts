import { Injectable, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import * as Parser from 'rss-parser';

@Injectable()
export class RssService {
  private readonly rssParser: Parser;
  constructor(private readonly configService: ConfigService) {
    this.rssParser = new Parser();
  }
  async getRssData(type: string, page: number, itemsPerPage: number) {
    try {
      const feed = await this.rssParser.parseURL(
        this.configService.get<string>(`VNEXPRESS_RSS_${type.toUpperCase()}`),
      );
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const totalItems = feed.items.length;
      const items = feed.items.slice(startIndex, endIndex);
      return {
        items,
        totalItems,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
