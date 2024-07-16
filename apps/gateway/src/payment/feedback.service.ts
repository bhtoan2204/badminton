import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PAYMENT_SERVICE } from '../utils';
import { ClientProxy } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Injectable()
export class FeedbackService {
  constructor(
    @Inject(PAYMENT_SERVICE) private paymentClient: ClientProxy,
    private readonly rmqService: RmqService,
  ) {}

  async createFeedback(id_user: number, dto: any) {
    try {
      return await this.rmqService.send(
        this.paymentClient,
        'paymentClient/createFeedback',
        { id_user, dto },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }
}
