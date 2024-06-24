import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PAYMENT_SERVICE } from '../utils';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';

@Injectable()
export class FeedbackService {
  constructor(@Inject(PAYMENT_SERVICE) private paymentClient: ClientProxy) {}

  async createFeedback(id_user: number, dto: any) {
    try {
      const response = this.paymentClient
        .send('paymentClient/createFeedback', { id_user, dto })
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
