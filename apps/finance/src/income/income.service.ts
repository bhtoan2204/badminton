import { FinanceIncome, FinanceIncomeSource, MemberFamily } from '@app/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { DailyIncomeData, MonthlyIncomeData } from './income.interface';

@Injectable()
export class IncomeService {
  constructor(
    @InjectRepository(FinanceIncome)
    private financeIncomeRepository: Repository<FinanceIncome>,
    @InjectRepository(FinanceIncomeSource)
    private financeIncomeSourceRepository: Repository<FinanceIncomeSource>,
    @InjectRepository(MemberFamily)
    private readonly memberFamilyRepository: Repository<MemberFamily>,
  ) {}

  async getIncomeSource(id_user: string, id_family: number) {
    try {
      const [data, total] =
        await this.financeIncomeSourceRepository.findAndCount({
          where: { id_family: id_family },
        });
      return {
        data: data,
        total: total,
        message: 'Get income source successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async createIncomeSource(id_user: string, dto: any) {
    try {
      const { id_family, income_source_name } = dto;
      const data = await this.financeIncomeSourceRepository.save({
        id_family,
        income_source_name,
      });
      return {
        data: data,
        message: 'Create income source successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateIncomeSource(id_user: string, dto: any) {
    try {
      const { id_income_source, id_family, income_source_name } = dto;
      const incomeSource = await this.financeIncomeSourceRepository.findOne({
        where: {
          id_income_source: id_income_source,
          id_family: id_family,
        },
      });
      if (!incomeSource) {
        throw new RpcException({
          message: 'Income source not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      incomeSource.income_source_name = income_source_name;
      const updatedIncomeSource =
        await this.financeIncomeSourceRepository.save(incomeSource);
      return {
        data: updatedIncomeSource,
        message: 'Update income source successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteIncomeSource(
    id_user: string,
    id_family: number,
    id_income_source: number,
  ) {
    try {
      const incomeSource = await this.financeIncomeSourceRepository.findOne({
        where: {
          id_income_source: id_income_source,
          id_family: id_family,
        },
      });
      if (!incomeSource) {
        throw new RpcException({
          message: 'Income source not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      await this.financeIncomeSourceRepository.remove(incomeSource);
      return {
        data: 'Income source deleted successfully',
        message: 'Delete income source successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getIncomeByDateRange(
    id_user: string,
    dto: {
      id_family: number;
      fromDate: string;
      toDate: string;
      page: number;
      itemsPerPage: number;
      sortBy: string;
      sortDirection: 'ASC' | 'DESC';
    },
  ) {
    try {
      const option = {
        where: {
          id_family: dto.id_family,
        },
        skip: (dto.page - 1) * dto.itemsPerPage,
        take: dto.itemsPerPage,
        relations: ['financeIncomeSource', 'users'],
      };
      if (dto.sortBy && dto.sortDirection) {
        option['order'] = {
          [dto.sortBy]: dto.sortDirection,
        };
      }
      if (dto.fromDate && dto.toDate) {
        option.where['income_date'] = Between(dto.fromDate, dto.toDate);
      }
      const [data, total] =
        await this.financeIncomeRepository.findAndCount(option);
      const sum = data.reduce((acc, cur) => acc + cur.amount, 0) || 0;
      return {
        data: data,
        sum: sum,
        total: total,
        message: 'Get income by date range',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getIncomeByDate(id_user: string, id_family: number, date: string) {
    try {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      const [data, count] = await this.financeIncomeRepository.findAndCount({
        where: {
          id_family,
          income_date: Between(startDate, endDate),
        },
        relations: ['financeIncomeSource', 'users'],
        order: { created_at: 'DESC' },
      });
      const sum = data.reduce((acc, cur) => acc + cur.amount, 0) || 0;
      return {
        data: data,
        total: count,
        sum: sum,
        message: 'Get expenditure by date',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getIncomeByYear(id_user: string, id_family: number, year: number) {
    try {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);

      const rawData = await this.financeIncomeRepository
        .createQueryBuilder('fi')
        .select('EXTRACT(MONTH FROM fi.income_date)', 'month')
        .addSelect('fi.id_income_source', 'id_income_source')
        .addSelect('fis.income_source_name', 'income_source_name')
        .addSelect('SUM(fi.amount)', 'total_amount')
        .where('fi.id_family = :id_family', { id_family })
        .andWhere('fi.income_date BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        })
        .leftJoin('fi.financeIncomeSource', 'fis')
        .groupBy(
          'EXTRACT(MONTH FROM fi.income_date), fi.id_income_source, fis.income_source_name',
        )
        .orderBy('EXTRACT(MONTH FROM fi.income_date)', 'ASC')
        .getRawMany();

      const monthlyIncomeData: MonthlyIncomeData[] = Array.from(
        { length: 12 },
        (_, i) => ({
          month: i + 1,
          total: 0,
          categories: [],
        }),
      );

      rawData.forEach((data) => {
        const monthIndex = parseInt(data.month, 10) - 1;
        monthlyIncomeData[monthIndex].total += parseFloat(data.total_amount);
        monthlyIncomeData[monthIndex].categories.push({
          name: data.income_source_name,
          amount: parseFloat(data.total_amount),
          id_income_source: parseInt(data.id_income_source, 10),
        });
      });

      return {
        data: monthlyIncomeData,
        total: rawData.length,
        message: 'Get income by year',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getIncomeByMonth(
    id_user: string,
    id_family: number,
    month: number,
    year: number,
  ) {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const rawData = await this.financeIncomeRepository
        .createQueryBuilder('fi')
        .select('EXTRACT(DAY FROM fi.income_date)', 'day')
        .addSelect('fi.id_income_source', 'id_income_source')
        .addSelect('fis.income_source_name', 'income_source_name')
        .addSelect('SUM(fi.amount)', 'total_amount')
        .where('fi.id_family = :id_family', { id_family })
        .andWhere('fi.income_date BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        })
        .leftJoin('fi.financeIncomeSource', 'fis')
        .groupBy(
          'EXTRACT(DAY FROM fi.income_date), fi.id_income_source, fis.income_source_name',
        )
        .orderBy('EXTRACT(DAY FROM fi.income_date)', 'ASC')
        .getRawMany();

      const daysInMonth = new Date(year, month, 0).getDate();
      const dailyIncomeData: DailyIncomeData[] = Array.from(
        { length: daysInMonth },
        (_, i) => ({
          day: i + 1,
          total: 0,
          categories: [],
        }),
      );

      rawData.forEach((data) => {
        const dayIndex = parseInt(data.day, 10) - 1;
        dailyIncomeData[dayIndex].total += parseFloat(data.total_amount);
        dailyIncomeData[dayIndex].categories.push({
          name: data.income_source_name,
          amount: parseFloat(data.total_amount),
          id_income_source: parseInt(data.id_income_source, 10),
        });
      });

      return {
        data: dailyIncomeData,
        total: rawData.length,
        message: 'Get income by month',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getIncomeById(id_user: string, id_family: number, id_income: number) {
    try {
      const income = await this.financeIncomeRepository.findOne({
        where: {
          id_income: id_income,
          id_family: id_family,
        },
        relations: ['financeIncomeSource', 'users'],
      });
      if (!income) {
        throw new RpcException({
          message: 'Income not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      return {
        data: income,
        message: 'Get income by id successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async createIncome(id_user: string, dto: any) {
    try {
      const {
        id_family,
        id_created_by,
        id_income_source,
        amount,
        income_date,
        description,
      } = dto;
      const incomeSource = await this.financeIncomeSourceRepository.findOne({
        where: {
          id_income_source: id_income_source,
          id_family: id_family,
        },
      });
      if (!incomeSource) {
        throw new RpcException({
          message: 'Income source not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      const memberFamily = await this.memberFamilyRepository.findOne({
        where: {
          id_user: id_created_by,
          id_family: id_family,
        },
      });
      if (!memberFamily) {
        throw new RpcException({
          message: 'Member family not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      const newIncome = await this.financeIncomeRepository.create({
        id_family,
        id_created_by,
        id_income_source,
        amount,
        income_date,
        description,
      });

      await this.financeIncomeRepository.save(newIncome);
      return {
        data: newIncome,
        message: 'Create income successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message || 'Create income failed',
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateIncome(id_user: string, dto: any) {
    try {
      const {
        id_income,
        id_family,
        id_created_by,
        id_income_source,
        amount,
        income_date,
        description,
      } = dto;
      const income = await this.financeIncomeRepository.findOne({
        where: {
          id_income: id_income,
          id_family: id_family,
        },
      });
      if (!income) {
        throw new RpcException({
          message: 'Income not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      if (id_created_by !== undefined) {
        income.id_created_by = id_created_by;
        const memberFamily = await this.memberFamilyRepository.findOne({
          where: {
            id_user: id_created_by,
            id_family: id_family,
          },
        });
        if (!memberFamily) {
          throw new RpcException({
            message: 'Member family not found',
            statusCode: HttpStatus.NOT_FOUND,
          });
        }
      }
      if (id_income_source !== undefined) {
        const incomeSource = await this.financeIncomeSourceRepository.findOne({
          where: {
            id_income_source: id_income_source,
            id_family: id_family,
          },
        });
        if (!incomeSource) {
          throw new RpcException({
            message: 'Income source not found',
            statusCode: HttpStatus.NOT_FOUND,
          });
        }
        income.id_income_source = id_income_source;
      }
      if (amount !== undefined) {
        income.amount = amount;
      }
      if (income_date !== undefined) {
        income.income_date = income_date;
      }
      if (description !== undefined) {
        income.description = description;
      }
      const updatedIncome = await this.financeIncomeRepository.save(income);
      return {
        data: updatedIncome,
        message: 'Update income successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteIncome(id_user: string, id_family: number, id_income: number) {
    try {
      const income = await this.financeIncomeRepository.findOne({
        where: {
          id_income: id_income,
          id_family: id_family,
        },
      });
      if (!income) {
        throw new RpcException({
          message: 'Income not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      await this.financeIncomeRepository.remove(income);
      return {
        data: 'Income deleted successfully',
        message: 'Delete income successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async addDefaultIncomeSource(id_family: number) {
    try {
      const defaultIncomeSources = [
        { income_source_name: 'Salary', income_source_name_vn: 'Lương' },
        { income_source_name: 'Services', income_source_name_vn: 'Dịch vụ' },
        { income_source_name: 'Investments', income_source_name_vn: 'Đầu tư' },
        { income_source_name: 'Rent', income_source_name_vn: 'Thuê' },
        { income_source_name: 'Dividends', income_source_name_vn: 'Cổ tức' },
        {
          income_source_name: 'Consulting fees',
          income_source_name_vn: 'Phí tư vấn',
        },
        {
          income_source_name: 'Royalties',
          income_source_name_vn: 'Tiền bản quyền',
        },
        { income_source_name: 'Grants', income_source_name_vn: 'Tài trợ' },
        { income_source_name: 'Bonuses', income_source_name_vn: 'Thưởng' },
        { income_source_name: 'Interest', income_source_name_vn: 'Lãi suất' },
      ];
      const incomeSourcesToInsert = defaultIncomeSources.map(
        (incomeSource) => ({
          id_family,
          ...incomeSource,
        }),
      );

      await this.financeIncomeSourceRepository
        .createQueryBuilder()
        .insert()
        .into(FinanceIncomeSource)
        .values(incomeSourcesToInsert)
        .execute();

      return {
        message: 'Default income sources added successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
