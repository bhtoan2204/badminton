import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { EntityManager } from 'typeorm';

@Injectable()
export class LoanService {
  constructor(private readonly entityManager: EntityManager) {}

  async getLoanCreditorType() {
    try {
      const query = 'SELECT * FROM finance_loan_creditor_type';
      const data = await this.entityManager.query(query);
      return {
        data: data,
        message: 'Get loan creditor type',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getLoan() {
    return 'Loan';
  }

  async createLoan() {
    return 'Loan created';
  }

  async updateLoan() {
    return 'Loan updated';
  }

  async deleteLoan() {
    return 'Loan deleted';
  }
}
