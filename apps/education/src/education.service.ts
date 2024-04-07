import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { EntityManager } from 'typeorm';

const limit = 20;

@Injectable()
export class EducationService {
  constructor(
    private readonly entityManager: EntityManager
  ) {}

  async createEducationProgress(owner_id_user: string, dto: any) {
    try {
      const { id_family, id_user, title, progress_notes, school_info } = dto
      const query = 'SELECT * FROM f_create_education_progress($1, $2, $3, $4, $5, $6)';
      const params = [owner_id_user, id_family, id_user, title, progress_notes, school_info];
      const data = await this.entityManager.query(query, params);
      return {
        message: 'Success',
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

  async getAllEducationProgress(id_user: string, pageNumber: number, itemsPerPage: number, id_family: number) {
    try {
      const skipAmount = (pageNumber - 1) * itemsPerPage;

      const query = 'SELECT * FROM f_get_all_education_progress($1, $2, $3, $4)';
      const params = [id_user, skipAmount, itemsPerPage, id_family];
      const data = await this.entityManager.query(query, params);
      return {
        message: 'Success',
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

  async getDetailEducationProgress(id_user: string, id_family: number, id_education_progress: number) {
    try {
      const query = 'SELECT * FROM f_get_detail_education_progress($1, $2, $3)';
      const params = [id_user, id_family, id_education_progress];
      const data = await this.entityManager.query(query, params);
      return {
        message: 'Success',
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

  async createSubject(id_user: string, dto: any) {
    try {
      const { id_education_progress, id_family, subject_name, description } = dto;
      const query = 'SELECT * FROM f_create_subject($1, $2, $3, $4, $5)';
      const params = [id_user, id_education_progress, id_family, subject_name, description];
      const data = await this.entityManager.query(query, params);
      return {
        message: 'Success',
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

  async getDetailSubject(id_user: string, id_family: number, id_education_progress: number, id_subject: number) {
    try {
      const query = 'SELECT * FROM f_get_detail_subject($1, $2, $3, $4)';
      const params = [id_user, id_family, id_education_progress, id_subject];
      const data = await this.entityManager.query(query, params);
      return {
        message: 'Success',
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
}
