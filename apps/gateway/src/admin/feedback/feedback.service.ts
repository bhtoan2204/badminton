import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PAYMENT_SERVICE } from '../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';

@Injectable()
export class FeedbackService {
  constructor(
    @Inject(PAYMENT_SERVICE)
    private readonly paymentClient: ClientProxy,
  ) {}

  async getCountAndAverageRatingFeedback() {
    try {
      const response = this.paymentClient
        .send('paymentClient/getCountAndAverageRatingFeedback', {})
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

  async getFeedback(
    page: number,
    itemsPerPage: number,
    search: string,
    sortBy: string,
    sortDesc: boolean,
    rate: number,
  ) {
    try {
      const response = this.paymentClient
        .send('paymentClient/getFeedback', {
          page,
          itemsPerPage,
          search,
          sortBy,
          sortDesc,
          rate,
        })
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
