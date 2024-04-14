import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { EntityManager } from 'typeorm';

@Injectable()
export class HouseholdService {
  constructor(
    private readonly entityManager: EntityManager
  ) {}

  async getCategory() {
    try {
      const query = 'SELECT * FROM household_item_categories';
      const data = await this.entityManager.query(query);
      return data;
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }
}
