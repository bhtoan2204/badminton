import { Controller, Get } from '@nestjs/common';
import { ElasticsearchService } from './elasticsearch.service';

@Controller()
export class ElasticsearchController {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  @Get()
  getHello(): string {
    return this.elasticsearchService.getHello();
  }
}
