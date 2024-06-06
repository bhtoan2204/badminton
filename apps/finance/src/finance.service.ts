import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { EntityManager } from 'typeorm';

@Injectable()
export class FinanceService {
  constructor(private readonly entityManager: EntityManager) {}

  async getFinanceSummary(id_user: string, id_family: number) {
    try {
      const query = 'SELECT * FROM f_get_finance_summary($1, $2)';
      const param = [id_user, id_family];
      const data = await this.entityManager.query(query, param);
      return {
        data: data[0],
        message: 'Get finance summary',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
