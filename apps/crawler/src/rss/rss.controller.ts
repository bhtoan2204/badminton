import { Controller, Get, Query } from "@nestjs/common";
import { RssService } from "./rss.service";

@Controller("rss")
export class RssController {
  constructor(
    private readonly rssService: RssService
  ) { }

  @Get('nld')
  async getNld(
    @Query('type') type: string,
    @Query('page') page: string,
    @Query('itemsPerPage') itemsPerPage: string
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const itemsPerPageNumber = parseInt(itemsPerPage, 10) || 10;
    return this.rssService.getRssData(type, pageNumber, itemsPerPageNumber);
  }
}