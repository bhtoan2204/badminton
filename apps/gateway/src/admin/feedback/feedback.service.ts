import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PAYMENT_SERVICE } from '../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Injectable()
export class FeedbackService {
  constructor(
    @Inject(PAYMENT_SERVICE)
    private readonly paymentClient: ClientProxy,
    private readonly rmqService: RmqService,
  ) {}

  async getCountAndAverageRatingFeedback() {
    try {
      return await this.rmqService.send(
        this.paymentClient,
        'paymentClient/getCountAndAverageRatingFeedback',
        {},
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
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
      return await this.rmqService.send(
        this.paymentClient,
        'paymentClient/getFeedback',
        {
          page,
          itemsPerPage,
          search,
          sortBy,
          sortDesc,
          rate,
        },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }
}
