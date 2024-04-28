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

  async getIncome(id_user: string, id_family: number, page: number, itemsPerPage: number) {
    try {
      const query = 'SELECT * FROM f_get_income($1, $2, $3, $4)';
      const params = [id_user, id_family, page, itemsPerPage];
      const data = await this.entityManager.query(query, params);
      return {
        data: data,
        message: 'Get income',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getIncomeById(id_user: string, id_family: number, id_income: number) {
    try {
      const query = 'SELECT * FROM f_get_income_by_id($1, $2, $3)';
      const params = [id_user, id_family, id_income];
      const data = await this.entityManager.query(query, params);
      return {
        data: data,
        message: 'Get income by id',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async createIncome(id_user: string, dto: any) {
    try {
      const { id_family, id_created_by, id_income_source, amount, income_date, description } = dto;
      const query = 'SELECT * FROM f_create_income($1, $2, $3, $4, $5, $6, $7)';
      const params = [id_user, id_family, id_created_by, id_income_source, amount, income_date, description];
      const data = await this.entityManager.query(query, params);
      return {
        data: data,
        message: 'Create income',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    
    }
  }

  async updateIncome(id_user: string, dto: any) {
    try {
      const { id_income, id_created_by, id_income_source, amount, income_date, description } = dto;
      const query = 'SELECT * FROM f_update_income($1, $2, $3, $4, $5, $6, $7)';
      const params = [id_user, id_income, id_created_by, id_income_source, amount, income_date, description];
      const data = await this.entityManager.query(query, params);
      return {
        data: data,
        message: 'Update income',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async deleteIncome(id_user: string, id_family: number, id_income: number) {
    try {
      const query = 'SELECT * FROM f_delete_income($1, $2, $3)';
      const params = [id_user, id_family, id_income];
      const data = await this.entityManager.query(query, params);
      const isDeleted = data[0].f_delete_income;
      if (!isDeleted) {
        throw new RpcException({
          message: 'Failed to delete income, maybe the income is not found',
          statusCode: HttpStatus.NOT_FOUND
        });
      }
      return {
        data: 'Income deleted successfully',
        message: 'Delete income',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }
  
}