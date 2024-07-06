import {
  FinanceExpenditure,
  FinanceExpenditureType,
  MemberFamily,
  UploadFileRequest,
} from '@app/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Between, EntityManager, Repository } from 'typeorm';
import { validate, version, NIL } from 'uuid';
import { StorageService } from '../storage/storage.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ExpenseditureService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly storageService: StorageService,
    @InjectRepository(FinanceExpenditure)
    private readonly financeExpenditureRepository: Repository<FinanceExpenditure>,
    @InjectRepository(FinanceExpenditureType)
    private readonly financeExpenditureTypeRepository: Repository<FinanceExpenditureType>,
    @InjectRepository(MemberFamily)
    private readonly memberFamilyRepository: Repository<MemberFamily>,
  ) {}

  convertStringToUUID(string: string): string {
    if (validate(string) && version(string)) {
      return string;
    }
    return NIL;
  }

  async getExpenseditureType(
    id_user: string,
    id_family: number,
    page: number,
    itemsPerPage: number,
  ) {
    try {
      const [data, total] =
        await this.financeExpenditureTypeRepository.findAndCount({
          where: { id_family },
          skip: (page - 1) * itemsPerPage,
          take: itemsPerPage,
          relations: ['family'],
        });
      return {
        data: data,
        total: total,
        message: 'Get expenditure types',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async createExpenseditureType(id_user: string, dto: any) {
    try {
      const { id_family, expense_type_name } = dto;
      const newExpenditureType = this.financeExpenditureTypeRepository.create({
        id_family: id_family,
        expense_type_name: expense_type_name,
      });
      await this.financeExpenditureTypeRepository.save(newExpenditureType);
      return {
        data: newExpenditureType,
        message: 'Create expenditure type',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateExpenseditureType(id_user: string, dto: any) {
    try {
      const { id_expenditure_type, id_family, expense_type_name } = dto;
      const updatedExpenditureType =
        await this.financeExpenditureTypeRepository.findOne({
          where: { id_expenditure_type, id_family },
        });
      if (!updatedExpenditureType) {
        throw new RpcException({
          message: 'Expenditure type not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      updatedExpenditureType.expense_type_name = expense_type_name;
      await this.financeExpenditureTypeRepository.save(updatedExpenditureType);
      return {
        data: updatedExpenditureType,
        message: 'Update expenditure type',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteExpenseditureType(
    id_user: string,
    id_family: number,
    id_expenditure_type: number,
  ) {
    try {
      const expenditureType =
        await this.financeExpenditureTypeRepository.findOne({
          where: { id_expenditure_type, id_family },
        });
      if (!expenditureType) {
        throw new RpcException({
          message: 'Expenditure type not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      await this.financeExpenditureTypeRepository.remove(expenditureType);
      return {
        data: 'Expenditure type deleted successfully',
        message: 'Delete expenditure type',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getExpenseByDate(id_user: string, id_family: number, date: Date) {
    try {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      const [data, count] =
        await this.financeExpenditureRepository.findAndCount({
          where: {
            id_family,
            expenditure_date: Between(startDate, endDate),
          },
          relations: ['family', 'financeExpenditureType', 'users'],
        });
      return {
        data: data,
        total: count,
        message: 'Get expenditure by date',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getExpenseByMonth(
    id_user: string,
    id_family: number,
    month: number,
    year: number,
  ) {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      const [data, count] =
        await this.financeExpenditureRepository.findAndCount({
          where: {
            id_family,
            expenditure_date: Between(startDate, endDate),
          },
          relations: ['family', 'financeExpenditureType', 'users'],
        });
      return {
        data: data,
        total: count,
        message: 'Get expenditure by month',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
  async getExpenseByYear(id_user: string, id_family: number, year: number) {
    try {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      const [data, count] =
        await this.financeExpenditureRepository.findAndCount({
          where: {
            id_family,
            expenditure_date: Between(startDate, endDate),
          },
          relations: ['family', 'financeExpenditureType', 'users'],
        });
      return {
        data: data,
        total: count,
        message: 'Get expenditure by year',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getExpenseByDateRange(
    id_user: string,
    id_family: number,
    fromDate: Date,
    toDate: Date,
    pageNumber: number,
    itemsPerPage: number,
  ) {
    try {
      const option = {
        where: {
          id_family,
        },
        skip: (pageNumber - 1) * itemsPerPage,
        take: itemsPerPage,
        relations: ['family', 'financeExpenditureType', 'users'],
      };
      if (fromDate && toDate) {
        option.where['expenditure_date'] = Between(fromDate, toDate);
      }
      const [data, total] =
        await this.financeExpenditureRepository.findAndCount(option);
      return {
        data: data,
        total: total,
        message: 'Get expenditure by date range',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getExpenditureById(
    id_user: string,
    id_family: number,
    id_expenditure: number,
  ) {
    try {
      const query = 'SELECT * FROM f_get_expenditure_by_id($1, $2, $3)';
      const params = [id_user, id_family, id_expenditure];
      const data = await this.entityManager.query(query, params);
      return {
        data: data,
        message: 'Get expenditure by id',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async createExpensediture(
    id_user: string,
    dto: {
      id_family: number;
      id_expenditure_type: number;
      amount: number;
      description: string;
      expenditure_date: Date;
      id_created_by: string;
    },
    file: any,
  ) {
    try {
      const {
        id_family,
        id_expenditure_type,
        amount,
        description,
        expenditure_date,
        id_created_by,
      } = dto;
      const expenseType = await this.financeExpenditureTypeRepository.findOne({
        where: { id_expenditure_type, id_family },
      });
      if (!expenseType) {
        throw new RpcException({
          message: 'Expenditure type not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      const member_family = await this.memberFamilyRepository.findOne({
        where: { id_family, id_user: id_created_by },
      });
      if (!member_family) {
        throw new RpcException({
          message: 'Member family not found (id_created_by)',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      let fileUrl = null;
      if (file) {
        const filename =
          'expense_' + id_user + '_' + Date.now() + '_' + file.originalname;
        const params: UploadFileRequest = {
          file: new Uint8Array(file.buffer.data),
          fileName: filename,
        };
        const uploadImageData =
          await this.storageService.uploadImageExpense(params);
        fileUrl = uploadImageData.fileUrl;
      }
      const newExpenditure = this.financeExpenditureRepository.create({
        id_family: id_family,
        id_expenditure_type: id_expenditure_type,
        amount: amount,
        description: description,
        expenditure_date: expenditure_date,
        id_created_by: id_created_by,
        image_url: fileUrl,
      });
      await this.financeExpenditureRepository.save(newExpenditure);
      return {
        data: newExpenditure,
        message: 'Create expenditure',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async transformEmptyStringsToNull(obj: any) {
    for (const key in obj) {
      if (obj[key] === '') {
        obj[key] = null;
      }
    }
    return obj;
  }

  async updateExpensediture(
    id_user: string,
    Dto: {
      id_expenditure: number;
      id_family: number;
      id_expenditure_type: number;
      amount: number;
      description: string;
      expenditure_date: Date;
      id_created_by: string;
    },
  ) {
    try {
      const dto: any = this.transformEmptyStringsToNull(Dto);

      const {
        id_expenditure,
        id_family,
        id_expenditure_type,
        amount,
        description,
        expenditure_date,
        id_created_by,
      } = dto;

      console.log(dto);

      const expenditure = await this.financeExpenditureRepository.findOne({
        where: { id_expenditure, id_family },
      });

      if (!expenditure) {
        throw new RpcException({
          message: 'Expenditure not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }

      if (id_expenditure_type !== undefined) {
        const expenseType = await this.financeExpenditureTypeRepository.findOne(
          {
            where: { id_expenditure_type, id_family },
          },
        );
        if (!expenseType) {
          throw new RpcException({
            message: 'Expenditure type not found',
            statusCode: HttpStatus.NOT_FOUND,
          });
        }
        expenditure.id_expenditure_type = id_expenditure_type;
      }

      if (amount !== undefined && amount !== null) {
        expenditure.amount = amount;
      }
      if (description !== undefined && description !== null) {
        expenditure.description = description;
      }
      if (expenditure_date !== undefined && expenditure_date !== null) {
        expenditure.expenditure_date = expenditure_date;
      }
      if (id_created_by !== undefined && id_created_by !== null) {
        expenditure.id_created_by = id_created_by;
      }

      const updatedExpenditure =
        await this.financeExpenditureRepository.save(expenditure);

      return {
        data: updatedExpenditure,
        message: 'Update expenditure',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteExpensediture(
    id_user: string,
    id_family: number,
    id_expenditure: number,
  ) {
    try {
      const expenditure = await this.financeExpenditureRepository.findOne({
        where: { id_expenditure, id_family },
      });
      if (!expenditure) {
        throw new RpcException({
          message: 'Expenditure not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      await this.financeExpenditureRepository.remove(expenditure);
      return {
        data: 'Expenditure deleted successfully',
        message: 'Delete expenditure',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
