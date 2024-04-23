import { HttpStatus, Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { EntityManager } from "typeorm";

@Injectable()
export class IncomeService {
  constructor(
    private readonly entityManager: EntityManager,
  ) { }

  async getIncomeSource() {
    try {
      const query = 'SELECT * FROM finance_income_source';
      const data = await this.entityManager.query(query);
      return {
        data: data,
        message: 'Get income source',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getIncome() {
    return 'Income';
  }

  async createIncome() {
    return 'Income created';
  }

  async updateIncome() {
    return 'Income updated';
  }

  async deleteIncome() {
    return 'Income deleted';
  }
  
}