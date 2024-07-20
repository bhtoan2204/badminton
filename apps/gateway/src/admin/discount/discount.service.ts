import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PAYMENT_SERVICE } from '../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { RmqService } from '@app/common';
import { CreateDiscountDto } from './dto/createDiscount.dto';
import { UpdateDiscountDto } from './dto/updateDiscount.dto';

@Injectable()
export class DiscountService {
  constructor(
    @Inject(PAYMENT_SERVICE) private paymentClient: ClientProxy,
    private readonly rmqService: RmqService,
  ) {}

  async addDiscount(dto: CreateDiscountDto): Promise<any> {
    try {
      return await this.rmqService.send(
        this.paymentClient,
        'paymentClient/addDiscount',
        dto,
      );
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getDiscounts(): Promise<any> {
    try {
      return await this.rmqService.send(
        this.paymentClient,
        'paymentClient/getDiscounts',
        {},
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async updateDiscount(dto: UpdateDiscountDto): Promise<any> {
    try {
      return await this.rmqService.send(
        this.paymentClient,
        'paymentClient/updateDiscount',
        dto,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async deleteDiscount(code: string): Promise<any> {
    try {
      return await this.rmqService.send(
        this.paymentClient,
        'paymentClient/deleteDiscount',
        code,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }
}
