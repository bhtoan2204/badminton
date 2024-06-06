import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { EntityManager } from 'typeorm';

const limit = 20;

@Injectable()
export class EducationService {
  constructor(private readonly entityManager: EntityManager) {}

  async createEducationProgress(owner_id_user: string, dto: any) {
    try {
      const { id_family, id_user, title, progress_notes, school_info } = dto;
      const query =
        'SELECT * FROM f_create_education_progress($1, $2, $3, $4, $5, $6)';
      const params = [
        owner_id_user,
        id_family,
        id_user,
        title,
        progress_notes,
        school_info,
      ];
      const data = await this.entityManager.query(query, params);
      return {
        message: 'Success',
        data: data,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getAllEducationProgress(
    id_user: string,
    pageNumber: number,
    itemsPerPage: number,
    id_family: number,
  ) {
    try {
      const skipAmount = (pageNumber - 1) * itemsPerPage;

      const query =
        'SELECT * FROM f_get_all_education_progress($1, $2, $3, $4)';
      const params = [id_user, skipAmount, itemsPerPage, id_family];
      const data = await this.entityManager.query(query, params);
      return {
        message: 'Success',
        data: data,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getDetailEducationProgress(
    id_user: string,
    id_family: number,
    id_education_progress: number,
  ) {
    try {
      const query = 'SELECT * FROM f_get_detail_education_progress($1, $2, $3)';
      const params = [id_user, id_family, id_education_progress];
      const data = await this.entityManager.query(query, params);
      return {
        message: 'Success',
        data: data,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateDetailEducationProgress(id_user: string, dto: any) {
    try {
      const {
        id_education_progress,
        id_family,
        title,
        progress_notes,
        school_info,
      } = dto;
      const query =
        'SELECT * FROM f_update_education_progress($1, $2, $3, $4, $5, $6)';
      const params = [
        id_user,
        id_education_progress,
        id_family,
        title,
        progress_notes,
        school_info,
      ];
      const data = await this.entityManager.query(query, params);
      return {
        message: 'Success',
        data: data,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteEducationProgress(
    id_user: string,
    id_family: number,
    id_education_progress: number,
  ) {
    try {
      const query = 'SELECT * FROM f_delete_education_progress($1, $2, $3)';
      const params = [id_user, id_family, id_education_progress];
      const data = await this.entityManager.query(query, params);
      return {
        message: 'Success',
        data: data[0].f_delete_education_progress,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async createSubject(id_user: string, dto: any) {
    try {
      const { id_education_progress, id_family, subject_name, description } =
        dto;
      const query = 'SELECT * FROM f_create_subject($1, $2, $3, $4, $5)';
      const params = [
        id_user,
        id_education_progress,
        id_family,
        subject_name,
        description,
      ];
      const data = await this.entityManager.query(query, params);
      return {
        message: 'Success',
        data: data,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getDetailSubject(
    id_user: string,
    id_family: number,
    id_education_progress: number,
    id_subject: number,
  ) {
    try {
      const query = 'SELECT * FROM f_get_detail_subject($1, $2, $3, $4)';
      const params = [id_user, id_family, id_education_progress, id_subject];
      const data = await this.entityManager.query(query, params);
      return {
        message: 'Success',
        data: data,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateDetailSubject(id_user: string, dto: any) {
    try {
      const {
        id_subject,
        id_education_progress,
        id_family,
        subject_name,
        description,
      } = dto;
      const query = 'SELECT * FROM f_update_subject($1, $2, $3, $4, $5, $6)';
      const params = [
        id_user,
        id_subject,
        id_education_progress,
        id_family,
        subject_name,
        description,
      ];
      const data = await this.entityManager.query(query, params);
      return {
        message: 'Success',
        data: data,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteSubject(
    id_user: string,
    id_family: number,
    id_education_progress: number,
    id_subject: number,
  ) {
    try {
      const query = 'SELECT * FROM f_delete_subject($1, $2, $3, $4)';
      const params = [id_user, id_family, id_education_progress, id_subject];
      const data = await this.entityManager.query(query, params);
      return {
        message: 'Success',
        data: data[0].f_delete_subject,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async addComponentScore(id_user: string, dto: any) {
    const {
      id_subject,
      id_education_progress,
      id_family,
      component_name,
      score,
    } = dto;
    try {
      const query =
        'SELECT * FROM f_add_component_score($1, $2, $3, $4, $5, $6)';
      const params = [
        id_user,
        id_subject,
        id_education_progress,
        id_family,
        component_name,
        score,
      ];
      const data = await this.entityManager.query(query, params);
      return {
        message: 'Success',
        data: data[0].f_add_component_score,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async insertComponentScore(id_user: string, dto: any) {
    const {
      id_subject,
      id_education_progress,
      id_family,
      component_name,
      score,
      index,
    } = dto;
    try {
      const query =
        'SELECT * FROM f_insert_component_score($1, $2, $3, $4, $5, $6, $7)';
      const params = [
        id_user,
        id_subject,
        id_education_progress,
        id_family,
        component_name,
        score,
        index,
      ];
      const data = await this.entityManager.query(query, params);
      return {
        message: 'Success',
        data: data[0].f_insert_component_score,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateComponentScore(id_user: string, dto: any) {
    const {
      index,
      id_subject,
      id_education_progress,
      id_family,
      component_name,
      score,
    } = dto;
    try {
      const query =
        'SELECT * FROM f_update_component_score($1, $2, $3, $4, $5, $6, $7)';
      const params = [
        id_user,
        id_subject,
        id_education_progress,
        id_family,
        component_name,
        score,
        index,
      ];
      const data = await this.entityManager.query(query, params);
      return {
        message: 'Success',
        data: data[0].f_update_component_score,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteComponentScore(id_user: string, dto: any) {
    const { id_subject, id_family, id_education_progress, index } = dto;
    try {
      const query =
        'SELECT * FROM f_delete_component_score($1, $2, $3, $4, $5)';
      const params = [
        id_user,
        id_subject,
        id_family,
        id_education_progress,
        index,
      ];
      const data = await this.entityManager.query(query, params);
      return {
        message: 'Success',
        data: data[0].f_delete_component_score,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async modifyScore(id_user: string, dto: any) {
    const {
      id_subject,
      id_education_progress,
      id_family,
      midterm_score,
      final_score,
      bonus_score,
    } = dto;
    try {
      const query = 'SELECT * FROM f_modify_score($1, $2, $3, $4, $5, $6, $7)';
      const params = [
        id_user,
        id_subject,
        id_education_progress,
        id_family,
        midterm_score,
        final_score,
        bonus_score,
      ];
      const data = await this.entityManager.query(query, params);
      return {
        message: 'Success',
        data: data[0].f_modify_score,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async removeScore(id_user: string, dto: any) {
    const { id_subject, id_family, id_education_progress, score_name } = dto;
    try {
      const query = 'SELECT * FROM f_remove_score($1, $2, $3, $4, $5)';
      const params = [
        id_user,
        id_subject,
        id_education_progress,
        id_family,
        score_name,
      ];
      const data = await this.entityManager.query(query, params);
      return {
        message: 'Success',
        data: data[0].f_remove_score,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async changeStatus(id_user: string, dto: any) {
    const { id_subject, id_education_progress, id_family, status } = dto;
    try {
      const query = 'SELECT * FROM f_change_status($1, $2, $3, $4, $5)';
      const params = [
        id_user,
        id_subject,
        id_education_progress,
        id_family,
        status,
      ];
      const data = await this.entityManager.query(query, params);
      return {
        message: 'Success',
        data: data[0].f_change_status,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
