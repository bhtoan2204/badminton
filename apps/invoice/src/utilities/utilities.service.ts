import { HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { StorageService } from '../storage/storage.service';
import { UploadFileRequest } from '@app/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UtilitiesService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly storageService: StorageService,
  ) {}

  async getUtilityTypes() {
    try {
      const data = await this.entityManager.query(
        `SELECT * FROM utilities_type;`,
      );
      return {
        data,
        message: 'Utility types retrieved successfully',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUtilities(id_family: number, page: number, itemsPerPage: number) {
    try {
      const [data, countResult] = await Promise.all([
        this.entityManager.query(
          `SELECT * FROM utilities WHERE id_family = $1 LIMIT $2 OFFSET $3;`,
          [id_family, itemsPerPage, (page - 1) * itemsPerPage]
        ),
        this.entityManager.query(
          `SELECT COUNT(*) FROM utilities WHERE id_family = $1;`,
          [id_family]
        )
      ]);
      const totalCount = parseInt(countResult[0].count, 10);
      return {
        data,
        totalCount,
        message: 'Utilities retrieved successfully',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUtility(id_family: number, id_utility: number) {
    try {
      const data = await this.entityManager.query(
        `SELECT * FROM utilities WHERE id_family = $1 AND id_utility = $2;`,
        [id_family, id_utility],
      );
      return {
        data: data[0],
        message: 'Utility retrieved successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async createUtility(id_user: string, dto: any, file: any) {
    try {
      let fileUrl = null;
      if (file) {
        const filename =
          'utility_' + id_user + '_' + Date.now() + '_' + file.originalname;
        const params: UploadFileRequest = {
          file: new Uint8Array(file.buffer.data),
          fileName: filename,
        };
        const uploadImageData =
          await this.storageService.uploadImageUtility(params);
        fileUrl = uploadImageData.fileUrl;
      }
      const data = await this.entityManager.query(
        `INSERT INTO utilities (id_family, id_utilities_type, value, description, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
        [
          dto.id_family,
          dto.id_utilities_type,
          dto.value,
          dto.description,
          fileUrl,
        ],
      );
      return {
        data: data[0],
        message: 'Utility created successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateUtility(id_user: string, dto: any, file: any) {
    try {
      // Preprocess dto to convert empty strings to null
      const { id_utilities_type, value, description, id_family, id_utility } =
        dto;
      const processedDto = {
        id_utilities_type: id_utilities_type === '' ? null : id_utilities_type,
        value: value === '' ? null : value,
        description: description === '' ? null : description,
        id_family,
        id_utility,
      };

      let fileUrl = null;
      if (file) {
        const filename =
          'utility_' + dto.id_user + '_' + Date.now() + '_' + file.originalname;
        const params: UploadFileRequest = {
          file: new Uint8Array(file.buffer.data),
          fileName: filename,
        };
        const uploadImageData =
          await this.storageService.uploadImageUtility(params);
        fileUrl = uploadImageData.fileUrl;
      }

      const data = await this.entityManager.query(
        `UPDATE utilities
             SET 
                id_utilities_type = COALESCE($1, id_utilities_type),
                value = COALESCE($2, value),
                description = COALESCE($3, description),
                image_url = COALESCE($4, image_url)
             WHERE id_family = $5 AND id_utility = $6
             RETURNING *;`,
        [
          processedDto.id_utilities_type,
          processedDto.value,
          processedDto.description,
          fileUrl,
          processedDto.id_family,
          processedDto.id_utility,
        ],
      );

      return {
        data: data[0],
        message: 'Utility updated successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteUtility(id_family: number, id_utility: number) {
    try {
      await this.entityManager.query(
        `DELETE FROM utilities WHERE id_family = $1 AND id_utility = $2 RETURNING *;`,
        [id_family, id_utility],
      );
      return {
        message: 'Utility deleted successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
