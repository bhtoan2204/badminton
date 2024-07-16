import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ELASTICSEARCH_SERVICE } from '../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Injectable()
export class PostgresqlService {
  constructor(
    @Inject(ELASTICSEARCH_SERVICE) private elasticsearchClient: ClientProxy,
    private readonly rmqService: RmqService,
  ) {}

  async getPostgresqlStat() {
    try {
      return await this.rmqService.send(
        this.elasticsearchClient,
        'datastatsClient/getPostgresqlStat',
        {},
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getMongooseStat() {
    try {
      return await this.rmqService.send(
        this.elasticsearchClient,
        'datastatsClient/getMongooseStat',
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
