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
}
