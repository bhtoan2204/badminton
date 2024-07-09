import { HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { StorageService } from '../storage/storage.service';
import { UploadFileRequest, Utilities, UtilitiesType } from '@app/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UtilitiesService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly storageService: StorageService,
    @InjectRepository(UtilitiesType)
    private utilitiesTypeRepository: Repository<UtilitiesType>,
    @InjectRepository(Utilities)
    private utilitiesRepository: Repository<Utilities>,
  ) {}

  async getUtilityTypes() {
    try {
      const [data, total] = await this.utilitiesTypeRepository.findAndCount();
      return {
        data,
        total,
        message: 'Utility types retrieved successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getUtilities(id_family: number, page: number, itemsPerPage: number) {
    try {
      const [data, total] = await this.utilitiesRepository.findAndCount({
        where: { id_family: id_family },
        order: { created_at: 'DESC' },
        skip: (page - 1) * itemsPerPage,
        take: itemsPerPage,
        relations: ['utilitiesType'],
      });
      return {
        data,
        total,
        message: 'Utilities retrieved successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getUtility(id_family: number, id_utility: number) {
    try {
      const data = await this.utilitiesRepository.findOne({
        where: { id_family, id_utility },
        relations: ['utilitiesType'],
      });
      if (!data) {
        throw new RpcException({
          message: 'Utility not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return {
        data,
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
      const { id_family, id_utilities_type, value, description } = dto;
      const newUtility = new Utilities();
      newUtility.id_family = id_family;
      newUtility.id_utilities_type = id_utilities_type;
      newUtility.value = value;
      newUtility.description = description;
      newUtility.image_url = fileUrl;
      const data = await this.utilitiesRepository.save(newUtility);
      return {
        data: data,
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
      const { id_utilities_type, value, description, id_family, id_utility } =
        dto;
      const updatedUtility = await this.utilitiesRepository.findOne({
        where: { id_family, id_utility },
      });
      if (!updatedUtility) {
        throw new RpcException({
          message: 'Utility not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      if (id_utilities_type)
        updatedUtility.id_utilities_type = id_utilities_type;
      if (value) updatedUtility.value = value;
      if (description) updatedUtility.description = description;
      if (fileUrl) updatedUtility.image_url = fileUrl;
      const data = await this.utilitiesRepository.save(updatedUtility);
      return {
        data: data,
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
      const utility = await this.utilitiesRepository.findOne({
        where: { id_family, id_utility },
      });
      if (!utility) {
        throw new RpcException({
          message: 'Utility not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      await this.utilitiesRepository.remove(utility);
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
