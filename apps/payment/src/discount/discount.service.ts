import { Discount } from '@app/common';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
  ) {}

  async addDiscount(dto: any): Promise<any> {
    try {
      console.log(dto);
      const { code, percentage, expired_at } = dto;
      const discount = await this.discountRepository.findOne({
        where: { code },
      });
      if (discount) {
        throw new BadRequestException({
          message: 'Discount code already exists',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
      const newDiscount = this.discountRepository.create({
        code,
        percentage,
        expired_at,
      });
      return await this.discountRepository.save(newDiscount);
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getDiscounts(): Promise<any> {
    try {
      return await this.discountRepository.find();
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateDiscount(dto: any): Promise<any> {
    try {
      const { code, percentage, expired_at } = dto;
      const discount = await this.discountRepository.findOne({
        where: { code },
      });
      if (!discount) {
        throw new RpcException({
          message: 'Discount not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      if (percentage < 0 || percentage > 100) {
        throw new RpcException({
          message: 'Percentage must be between 0 and 100',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
      discount.percentage = percentage || discount.percentage;
      discount.expired_at = expired_at || discount.expired_at;
      return await this.discountRepository.save(discount);
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteDiscount(code: string): Promise<any> {
    try {
      const discount = await this.discountRepository.findOne({
        where: { code },
      });
      if (!discount) {
        throw new RpcException({
          message: 'Discount not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return await this.discountRepository.remove(discount);
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
