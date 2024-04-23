import { HttpStatus, Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { EntityManager } from "typeorm";

@Injectable()
export class ExpenseditureService {
  constructor(
    private readonly entityManager: EntityManager,
  ) { }

  async getExpenseditureType() {
    try {
      const query = 'SELECT * FROM finance_expenditure_type';
      const data = await this.entityManager.query(query);
      return {
        data: data,
        message: 'Get expenditure type',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getExpensediture() {
    return 'Expensediture';
  }

  async createExpensediture() {
    return 'Expensediture created';
  }

  async updateExpensediture() {
    return 'Expensediture updated';
  }

  async deleteExpensediture() {
    return 'Expensediture deleted';
  }
}