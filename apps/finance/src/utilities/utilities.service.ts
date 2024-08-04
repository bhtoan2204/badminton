import { HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { StorageService } from '../storage/storage.service';
import {
  FinanceExpenditure,
  FinanceExpenditureType,
  UploadFileRequest,
  Utilities,
  UtilitiesType,
} from '@app/common';
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
    @InjectRepository(FinanceExpenditureType)
    private financeExpenditureTypeRepository: Repository<FinanceExpenditureType>,
    @InjectRepository(FinanceExpenditure)
    private financeExpenditureRepository: Repository<FinanceExpenditure>,
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

  async getUtilities(dto: {
    id_family: number;
    page: number;
    itemsPerPage: number;
    sortBy: string;
    sortDirection: 'ASC' | 'DESC';
  }) {
    try {
      const option = {
        where: { id_family: dto.id_family },
        skip: (dto.page - 1) * dto.itemsPerPage,
        take: dto.itemsPerPage,
        relations: ['utilitiesType'],
      };
      if (dto.sortBy && dto.sortDirection) {
        option['order'] = {
          [dto.sortBy]: dto.sortDirection,
        };
      }
      const [data, total] = await this.utilitiesRepository.findAndCount(option);
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
    const queryRunner =
      this.utilitiesRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

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

      const utility = await queryRunner.manager.save(Utilities, newUtility);

      let expenditureType = await this.financeExpenditureTypeRepository.findOne(
        {
          where: {
            expense_type_name: 'Utilities',
            id_family: newUtility.id_family,
          },
        },
      );

      if (!expenditureType) {
        expenditureType = await queryRunner.manager.save(
          FinanceExpenditureType,
          {
            id_family: newUtility.id_family,
            expense_type_name: 'Utilities',
          },
        );
      }

      const expenditure = this.financeExpenditureRepository.create({
        id_family: newUtility.id_family,
        id_expenditure_type: expenditureType.id_expenditure_type,
        amount: newUtility.value,
        image_url: newUtility.image_url,
        description: newUtility.description,
        expenditure_date: new Date(),
        id_utility: utility.id_utility,
        id_user: id_user,
      });

      const savedExpenditure = await queryRunner.manager.save(
        FinanceExpenditure,
        expenditure,
      );

      utility.id_expenditure = savedExpenditure.id_expenditure;
      const savedUtility = await queryRunner.manager.save(Utilities, utility);

      await queryRunner.commitTransaction();
      return {
        data: savedUtility,
        message: 'Utility created successfully',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    } finally {
      await queryRunner.release();
    }
  }

  async updateUtility(id_user: string, dto: any, file: any) {
    const queryRunner =
      this.utilitiesRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

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

      const updatedData = await queryRunner.manager.save(
        Utilities,
        updatedUtility,
      );

      const expenditure = await this.financeExpenditureRepository.findOne({
        where: { id_utility: updatedUtility.id_utility },
      });

      if (expenditure) {
        expenditure.amount = updatedUtility.value;
        expenditure.image_url = updatedUtility.image_url;
        expenditure.description = updatedUtility.description;
        expenditure.expenditure_date = new Date();

        await queryRunner.manager.save(FinanceExpenditure, expenditure);
      }

      await queryRunner.commitTransaction();
      return {
        data: updatedData,
        message: 'Utility updated successfully',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new RpcException({
        message: error.message || 'Internal server error',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    } finally {
      await queryRunner.release();
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
