import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ELASTICSEARCH_SERVICE, PAYMENT_SERVICE } from '../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { GetOrderStatisticsDto } from './dto/getOrderStatistics.dto';

@Injectable()
export class DatafetcherService {
  constructor(
    @Inject(ELASTICSEARCH_SERVICE) private elasticsearchClient: ClientProxy,
    @Inject(PAYMENT_SERVICE) private paymentClient: ClientProxy,
  ) {}

  async getIpData(ip: string) {
    try {
      const response = this.elasticsearchClient
        .send('datafetcherClient/getIpData', { ip })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getSummary() {
    try {
      const response = this.elasticsearchClient
        .send('datafetcherClient/getSummary', {})
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getRevenueLast6Months() {
    try {
      const response = this.elasticsearchClient
        .send('datafetcherClient/getRevenueLast6Months', {})
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getListOrders(dto: any) {
    try {
      const response = this.paymentClient
        .send('paymentClient/getListOrders', dto)
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getOrderStatistics(dto: GetOrderStatisticsDto) {
    try {
      const response = this.paymentClient
        .send('paymentClient/getOrderStatistics', dto)
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}
