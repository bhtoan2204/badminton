import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ELASTICSEARCH_SERVICE } from '../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Injectable()
export class RabbitMqService {
  constructor(
    @Inject(ELASTICSEARCH_SERVICE) private elasticsearchClient: ClientProxy,
    private readonly rmqService: RmqService,
  ) {}

  async getQueues(): Promise<any> {
    try {
      return await this.rmqService.send(
        this.elasticsearchClient,
        'rabbitMqClient/getQueues',
        {},
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }
  async getQueueDetails(queueName: string): Promise<any> {
    try {
      return await this.rmqService.send(
        this.elasticsearchClient,
        'rabbitMqClient/getQueueDetail',
        { queueName },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getNode(): Promise<any> {
    try {
      return await this.rmqService.send(
        this.elasticsearchClient,
        'rabbitMqClient/getNode',
        {},
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getNodeStatistics(nodeName: string): Promise<any> {
    try {
      return await this.rmqService.send(
        this.elasticsearchClient,
        'rabbitMqClient/getNodeStatistics',
        { nodeName },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }
  async getLogs(limit: number, offset: number): Promise<any> {
    try {
      return await this.rmqService.send(
        this.elasticsearchClient,
        'rabbitMqClient/getLogs',
        { limit, offset },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }
  async healthCheck(): Promise<any> {
    try {
      return await this.rmqService.send(
        this.elasticsearchClient,
        'rabbitMqClient/healthCheck',
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
