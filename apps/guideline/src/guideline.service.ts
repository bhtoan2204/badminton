import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { EntityManager } from 'typeorm';

@Injectable()
export class GuidelineService {
  constructor(
    private readonly entityManager: EntityManager
  ) { }

  async getAllGuideline(id_user: string, id_family: number, inputPage: number, inputItemsPerPage: number) {
    try {
      const page = inputPage || 1;
      const itemsPerPage = inputItemsPerPage || 10;
      const query = 'SELECT * FROM f_get_guidelines($1, $2, $3, $4)';
      const parameters = [id_user, id_family, page, itemsPerPage];
      const data = await this.entityManager.query(query, parameters);
      return {
        message: "Success",
        data: data
      };
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getGuideline(id_user: string, id_family: number, id_guideline: number) {
    try {
      const query = 'SELECT * FROM f_get_guideline($1, $2, $3)';
      const parameters = [id_user, id_family, id_guideline];
      const data = await this.entityManager.query(query, parameters);
      return {
        message: "Success",
        data: data
      };
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async createGuideline(id_user: string, { id_family, name, description }) {
    try {
      const query = 'SELECT * FROM f_create_guideline($1, $2, $3, $4)';
      const parameters = [id_user, id_family, name, description];
      const data = await this.entityManager.query(query, parameters);
      return {
        message: "Success",
        data: data[0]
      };
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async updateGuideline(id_user: any, dto: any) {
    try {
      const query = 'SELECT * FROM f_update_guideline($1, $2, $3, $4, $5)';
      const parameters = [id_user, dto.id_family, dto.id_guideline, dto.name, dto.description];
      const data = await this.entityManager.query(query, parameters);
      return {
        message: "Success",
        data: data[0].f_update_guideline
      };
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async deleteGuideline(id_user: string, id_family: number, id_guideline: number) {
    try {
      const query = 'SELECT * FROM f_delete_guideline($1, $2, $3)';
      const parameters = [id_user, id_family, id_guideline];
      const data = await this.entityManager.query(query, parameters);
      return {
        message: "Success",
        data: data[0].f_delete_guideline
      };
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }
}
