import { HttpStatus, Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { EntityManager } from "typeorm";
import { validate, version, NIL } from 'uuid';

@Injectable()
export class IncomeService {
  constructor(
    private readonly entityManager: EntityManager,
  ) { }

  convertStringToUUID(string: string): string {
    if (validate(string) && version(string)) {
      return string;
    }
    return NIL;
  }

  async getIncomeSource(id_user: string, id_family: number) {
    try {
      const query = 'SELECT * FROM f_get_finance_income_source($1, $2)';
      const params = [id_user, id_family];
      const data = await this.entityManager.query(query, params);
      return {
        data: data[0]?.f_get_finance_income_source || [], 
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

  async createIncomeSource(id_user: string, dto: any) {
    try {
      const { id_family, name } = dto;
      const query = 'SELECT * FROM f_create_finance_income_source($1, $2, $3)';
      const params = [id_user, id_family, name];
      const data = await this.entityManager.query(query, params);
      return {
        data: {
          id_family: id_family,
          name: name,
          id_income_source: data[0].f_create_finance_income_source
        },
        message: 'Create income source',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async updateIncomeSource(id_user: string, dto: any) {
    try {
      const { id_income, id_family, name } = dto;
      const query = 'SELECT * FROM f_update_finance_income_source($1, $2, $3, $4)';
      const params = [id_user, id_income, id_family, name];
      await this.entityManager.query(query, params);
      return {
        data: {
          id_income_source: id_income,
          income_name: name,
          id_family
        },
        message: 'Update income source',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async deleteIncomeSource(id_user: string, id_family: number, id_income_source: number) {
    try {
      const query = 'SELECT * FROM f_delete_finance_income_source($1, $2, $3)';
      const params = [id_user, id_family, id_income_source];
      await this.entityManager.query(query, params);
      return {
        data: 'Income source deleted successfully',
        message: 'Delete income source',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }
  async getIncomeByDay(id_user: string, id_family: number, date: string) {
    try {
      const query = 'SELECT * FROM f_get_income_by_date($1, $2, $3)';
      const params = [id_user, id_family, date];
      const data = await this.entityManager.query(query, params);
      return {
        data: data[0]?.f_get_income_by_date || [],
        message: 'Get income by date',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getIncomeByYear(id_user: string, id_family: number, year: number) {
    try {
      const query = 'SELECT * FROM f_get_income_by_year($1, $2, $3)';
      const params = [id_user, id_family, year];
      const data = await this.entityManager.query(query, params);
      return {
        data: data[0]?.f_get_income_by_year || [],
        message: 'Get income by year',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getIncomeByMonth(id_user: string, id_family: number,month : number, year: number) {
    try {
      const query = 'SELECT * FROM f_get_income_by_month($1, $2, $3, $4)';
      const params = [id_user, id_family, month, year];
      const data = await this.entityManager.query(query, params);
      return {
        data: data[0]?.f_get_income_by_month || [],
        message: 'Get income by month',
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

  async getStasticalIncome(id_user: string, id_family: number) {
    try {
      const query = 'SELECT * FROM f_get_statiscal_income($1, $2)';
      const params = [this.convertStringToUUID(id_user), id_family];
      const data = await this.entityManager.query(query, params);
      return {
        data: data,
        message: 'Get statiscal income',
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