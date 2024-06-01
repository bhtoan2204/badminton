import { HttpException, Inject, Injectable } from "@nestjs/common";
import { ELASTICSEARCH_SERVICE } from "../../utils";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom, timeout } from "rxjs";

@Injectable()
export class RabbitMqService {
  constructor(
    @Inject(ELASTICSEARCH_SERVICE) private elasticsearchClient: ClientProxy
  ){}

  async getQueues(): Promise<any> {
    try {
      const response = this.elasticsearchClient.send('rabbitMqClient/getQueues', {})
        .pipe(
          timeout(15000),
        );
      const data = await lastValueFrom(response);
      return data;
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
  async getQueueDetails(queueName: string): Promise<any> {
    try {
      const response = this.elasticsearchClient.send('rabbitMqClient/getQueueDetail', { queueName })
        .pipe(
          timeout(15000),
        );
      const data = await lastValueFrom(response);
      return data;
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getNode(): Promise<any> {
    try {
      const response = this.elasticsearchClient.send('rabbitMqClient/getNode', {})
        .pipe(
          timeout(15000),
        );
      const data = await lastValueFrom(response);
      return data;
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getNodeStatistics(nodeName: string): Promise<any> {
    try {
      const response = this.elasticsearchClient.send('rabbitMqClient/getNodeStatistics', { nodeName })
        .pipe(
          timeout(15000),
        );
      const data = await lastValueFrom(response);
      return data;
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
  async getLogs(limit: number, offset: number): Promise<any> {
    try {
      const response = this.elasticsearchClient.send('rabbitMqClient/getLogs', { limit, offset })
        .pipe(
          timeout(15000),
        );
      const data = await lastValueFrom(response);
      return data;
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
  async healthCheck(): Promise<any> {
    try {
      const response = this.elasticsearchClient.send('rabbitMqClient/healthCheck', {})
        .pipe(
          timeout(15000),
        );
      const data = await lastValueFrom(response);
      return data;
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}