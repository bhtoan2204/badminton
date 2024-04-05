import { Injectable } from '@nestjs/common';

@Injectable()
export class ElasticsearchService {
  getHello(): string {
    return 'Hello World!';
  }
}
