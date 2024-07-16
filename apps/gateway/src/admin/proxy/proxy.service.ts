import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ELASTICSEARCH_SERVICE } from '../../utils';
import { RmqService } from '@app/common';

@Injectable()
export class ProxyService {
  constructor(
    @Inject(ELASTICSEARCH_SERVICE) private elasticsearchClient: ClientProxy,
    private readonly rmqService: RmqService,
  ) {}

  async getZone() {
    try {
      return await this.rmqService.send(
        this.elasticsearchClient,
        'proxyClient/getZone',
        {},
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getAnalytics(dto: any) {
    try {
      return await this.rmqService.send(
        this.elasticsearchClient,
        'proxyClient/analytics',
        dto,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }
}
