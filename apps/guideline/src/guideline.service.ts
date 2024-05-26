import { UploadFileRequest } from '@app/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { EntityManager } from 'typeorm';
import { StorageService } from './storage/storage.service';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class GuidelineService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly storageService: StorageService,
    private readonly elasticsearchService: ElasticsearchService
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
        data: data[0].f_get_guidelines
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

  async getStep(id_user: string, id_family: number, id_guideline: number) {
    try {
      const query = 'SELECT * FROM f_get_guideline_step($1, $2, $3)';
      const parameters = [id_user, id_family, id_guideline];
      const data = await this.entityManager.query(query, parameters);
      return {
        message: "Success",
        data: data[0].f_get_guideline_step
      };
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async addStep(id_user: string, { id_family, id_guideline, name, description }, file: any) {
    try {
      const query = 'SELECT * FROM f_is_user_member_of_family($1, $2)';
      const parameters = [id_user, id_family];
      const isUserMemberOfFamily = await this.entityManager.query(query, parameters);
      if (isUserMemberOfFamily[0].f_is_user_member_of_family === false) {
        throw new RpcException({
          message: 'You are not a member of this family',
          statusCode: HttpStatus.UNAUTHORIZED
        });
      }
      let fileUrl = null;
      if (file) {
        const filename = 'step_' + id_user + '_' + Date.now() + '_' + file.originalname;
        const params: UploadFileRequest = {
          fileName: filename,
          file: new Uint8Array(file.buffer.data)
        }
        const uploadImageData = await this.storageService.uploadImageStep(params);
        fileUrl = uploadImageData.fileUrl;
      }
      const addStepQuery = 'SELECT * FROM f_add_guideline_step($1, $2, $3, $4, $5, $6)';
      const addStepParameters = [id_user, id_family, id_guideline, name, description, fileUrl];
      const data = await this.entityManager.query(addStepQuery, addStepParameters);

      return {
        message: "Success",
        data: data[0].f_add_guideline_step
      };
    }
    catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async insertStep(id_user: string, { id_family, id_guideline, name, description, index }, file: any) {
    try {
      const query = 'SELECT * FROM f_is_user_member_of_family($1, $2)';
      const parameters = [id_user, id_family];
      const isUserMemberOfFamily = await this.entityManager.query(query, parameters);
      if (isUserMemberOfFamily[0].f_is_user_member_of_family === false) {
        throw new RpcException({
          message: 'You are not a member of this family',
          statusCode: HttpStatus.UNAUTHORIZED
        });
      }
      let fileUrl = null;
      if (file) {
        const filename = 'step_' + id_user + '_' + Date.now() + '_' + file.originalname;
        const params: UploadFileRequest = {
          fileName: filename,
          file: new Uint8Array(file.buffer.data)
        }
        const uploadImageData = await this.storageService.uploadImageStep(params);
        fileUrl = uploadImageData.fileUrl;
      }
      const addStepQuery = 'SELECT * FROM f_insert_guideline_step($1, $2, $3, $4, $5, $6, $7)';
      const addStepParameters = [id_user, id_family, id_guideline, name, description, fileUrl, index];
      const data = await this.entityManager.query(addStepQuery, addStepParameters);

      return {
        message: "Success",
        data: data[0].f_insert_guideline_step
      };
    }
    catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async updateStep(id_user: string, { id_family, id_guideline, name, description, index }, file: any) {
    try {
      const query = 'SELECT * FROM f_is_user_member_of_family($1, $2)';
      const parameters = [id_user, id_family];
      const isUserMemberOfFamily = await this.entityManager.query(query, parameters);
      if (isUserMemberOfFamily[0].f_is_user_member_of_family === false) {
        throw new RpcException({
          message: 'You are not a member of this family',
          statusCode: HttpStatus.UNAUTHORIZED
        });
      }
      let fileUrl = null;
      if (file) {
        const oldImageUriQuery = 'SELECT * FROM f_get_step_image_url($1, $2, $3, $4)';
        const oldImageUriParameters = [id_user, id_family, id_guideline, index];
        const oldImageUri = await this.entityManager.query(oldImageUriQuery, oldImageUriParameters);
        if (oldImageUri[0].f_get_step_image_url !== null) {
          await this.storageService.deleteImageStep(oldImageUri[0].f_get_step_image_url);
        }
        const filename = 'step_' + id_user + '_' + Date.now() + '_' + file.originalname;
        const params: UploadFileRequest = {
          fileName: filename,
          file: new Uint8Array(file.buffer.data)
        }
        const uploadImageData = await this.storageService.uploadImageStep(params);
        fileUrl = uploadImageData.fileUrl;
      }
      const updateStepQuery = 'SELECT * FROM f_update_guideline_step($1, $2, $3, $4, $5, $6, $7)';
      const updateStepParameters = [id_user, id_family, id_guideline, index, name, description, fileUrl];
      const data = await this.entityManager.query(updateStepQuery, updateStepParameters);

      return {
        message: "Success",
        data: data[0].f_update_guideline_step
      };
    }
    catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async deleteStep(id_user: string, id_family: number, id_guideline: number, index: number) {
    try {
      const query = 'SELECT * FROM f_delete_guideline_step($1, $2, $3, $4)';
      const parameters = [id_user, id_family, id_guideline, index];
      const data = await this.entityManager.query(query, parameters);
      if (data[0].f_delete_guideline_step !== null) {
        const filename = data[0].f_delete_guideline_step;
        await this.storageService.deleteImageStep(filename);
      }
      return {
        message: "Success",
        data: "Delete step successfully"
      };
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async markShared(id_user: string, id_family: number, id_guideline: number) {
    try {
      const query = 'SELECT * FROM f_mark_guideline_shared($1, $2, $3)';
      const parameters = [id_user, id_family, id_guideline];
      const data = await this.entityManager.query(query, parameters);
      return {
        message: "Success",
        data: data[0].f_mark_guideline_shared
      };
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getSharedGuideline(text: string, page: number, itemsPerPage: number, sort: 'asc' | 'desc' | 'none') {
    try {
      const sortOption = sort !== 'none' ? [{ updated_at: { order: sort } }] : [];
      const query = text
        ? {
            multi_match: {
              query: text,
              fields: ['name', 'description'],
              fuzziness: 'AUTO',
            },
          }
        : { match_all: {} };
      const body = await this.elasticsearchService.search({
        index: 'guideline',
        from: (page - 1) * itemsPerPage,
        size: itemsPerPage,
        body: {
          query: query,
          sort: sortOption,
        },
      });

      const results = body.hits.hits.map(hit => hit._source);
      const total = body.hits.total;

      return {
        results,
        total,
        page,
        itemsPerPage
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
