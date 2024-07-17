import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ELASTICSEARCH_SERVICE, PAYMENT_SERVICE } from '../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { GetOrderStatisticsDto } from './dto/getOrderStatistics.dto';
import { RmqService } from '@app/common';

@Injectable()
export class DatafetcherService {
  constructor(
    @Inject(ELASTICSEARCH_SERVICE) private elasticsearchClient: ClientProxy,
    @Inject(PAYMENT_SERVICE) private paymentClient: ClientProxy,
    private readonly rmqService: RmqService,
  ) {}

  async getIpData(ip: string) {
    try {
      return await this.rmqService.send(
        this.elasticsearchClient,
        'datafetcherClient/getIpData',
        { ip },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getSummary() {
    try {
      return await this.rmqService.send(
        this.elasticsearchClient,
        'datafetcherClient/getSummary',
        {},
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getRevenueLast6Months() {
    try {
      return await this.rmqService.send(
        this.elasticsearchClient,
        'datafetcherClient/getRevenueLast6Months',
        {},
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getListOrders(dto: any) {
    try {
      return await this.rmqService.send(
        this.paymentClient,
        'paymentClient/getListOrders',
        dto,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getOrderStatistics(dto: GetOrderStatisticsDto) {
    try {
      return await this.rmqService.send(
        this.paymentClient,
        'paymentClient/getOrderStatistics',
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
