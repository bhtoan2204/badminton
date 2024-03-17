import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CrawlerService } from "./crawler.service";

@ApiTags('RSS and Crawler')
@Controller('crawler')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) { }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '' })
  @ApiQuery({ name: 'type', required: true, type: String })
  @ApiQuery({ name: 'page', required: false, type: String })
  @ApiQuery({ name: 'itemsPerPage', required: false, type: String })
  @Get('news')
  async getNews(
    @Query('type') type: string,
    @Query('page') page: string,
    @Query('itemsPerPage') itemsPerPage: string
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const itemsPerPageNumber = parseInt(itemsPerPage, 10) || 10;
    return this.crawlerService.getRssData(type, pageNumber, itemsPerPageNumber);
  }
}