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

  async getExpensediture(id_user: string, id_family: number, page: number, itemsPerPage: number) {
    try {
      const query = 'SELECT * FROM f_get_expenditure($1, $2, $3, $4)';
      const params = [id_user, id_family, page, itemsPerPage];
      const data = await this.entityManager.query(query, params);
      return {
        data: data,
        message: 'Get expenditure',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getExpenseditureById(id_user: string, id_family: number, id_expenditure: number) {
    try {
      const query = 'SELECT * FROM f_get_expenditure_by_id($1, $2, $3)';
      const params = [id_user, id_family, id_expenditure];
      const data = await this.entityManager.query(query, params);
      return {
        data: data,
        message: 'Get expenditure by id',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getExpenditureById(id_user: string, id_family: number, id_expenditure: number) {
    try {
      const query = 'SELECT * FROM f_get_expenditure_by_id($1, $2, $3)';
      const params = [id_user, id_family, id_expenditure];
      const data = await this.entityManager.query(query, params);
      return {
        data: data,
        message: 'Get expenditure by id',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async createExpensediture(id_user: string, dto: any) {
    try {
      const { id_family, id_created_by, id_expense_type, amount, expenditure_date, description } = dto;
      const query = 'SELECT * FROM f_create_expenditure($1, $2, $3, $4, $5, $6, $7)';
      const params = [id_user, id_family, id_created_by, id_expense_type, amount, expenditure_date, description];
      const data = await this.entityManager.query(query, params);
      return {
        data: data,
        message: 'Create expenditure',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    
    }
  }

  async updateExpensediture(id_user: string, dto: any) {
    try {
      const { id_expenditure, id_created_by, id_expense_type, amount, expenditure_date, description } = dto;
      const query = 'SELECT * FROM f_update_expenditure($1, $2, $3, $4, $5, $6, $7)';
      const params = [id_user, id_expenditure, id_created_by, id_expense_type, amount, expenditure_date, description];
      const data = await this.entityManager.query(query, params);
      return {
        data: data,
        message: 'Update expenditure',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async deleteExpensediture(id_user: string, id_family: number, id_expenditure: number) {
    try {
      const query = 'SELECT * FROM f_delete_expenditure($1, $2, $3)';
      const params = [id_user, id_family, id_expenditure];
      const data = await this.entityManager.query(query, params);
      const isDeleted = data[0].f_delete_expenditure;
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
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }
}