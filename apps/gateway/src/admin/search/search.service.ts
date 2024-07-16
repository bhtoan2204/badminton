import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ELASTICSEARCH_SERVICE } from '../../utils';
import { RmqService } from '@app/common';

@Injectable()
export class SearchService {
  constructor(
    @Inject(ELASTICSEARCH_SERVICE) private elasticsearchClient: ClientProxy,
    private readonly rmqService: RmqService,
  ) {}

  async getLogsCount() {
    try {
      return await this.rmqService.send(
        this.elasticsearchClient,
        'elasticsearchClient/getLogsCount',
        {},
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getLogs(dto: any) {
    try {
      return await this.rmqService.send(
        this.elasticsearchClient,
        'elasticsearchClient/getLogs',
        dto,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getLogsCountByTimeRange(dto: any) {
    try {
      return await this.rmqService.send(
        this.elasticsearchClient,
        'elasticsearchClient/getLogsCountByTimeRange',
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
