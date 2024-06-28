import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CrawlerService } from './crawler.service';
import { JwtAuthGuard } from '../utils';

@ApiTags('RSS and Crawler')
@Controller('crawler')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get categories news' })
  @Get('categories')
  async getCategories() {
    return this.crawlerService.getCategoriesNews();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get news by category',
  })
  @ApiQuery({ name: 'id_article_category', required: true, type: Number })
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'itemsPerPage', required: false, type: String })
  @Get('news')
  async getNews(
    @Query('id_article_category') id_article_category: number,
    @Query('page') page: string,
    @Query('itemsPerPage') itemsPerPage: string,
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const itemsPerPageNumber = parseInt(itemsPerPage, 10) || 10;
    return this.crawlerService.getRssData(
      id_article_category,
      pageNumber,
      itemsPerPageNumber,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get local bank interest' })
  @Get('localBankInterest')
  async getInternationalBankData() {
    return this.crawlerService.scrapeInterestRatesLocalBank();
  }
}
