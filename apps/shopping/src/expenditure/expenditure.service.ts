import { FinanceExpenditure, FinanceExpenditureType } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FinanceExpenditureService {
  constructor(
    @InjectRepository(FinanceExpenditure)
    private financeExpenditureRepository: Repository<FinanceExpenditure>,
    @InjectRepository(FinanceExpenditureType)
    private financeExpenditureTypeRepository: Repository<FinanceExpenditureType>,
  ) {}

  async createExpenditure(data: {
    id_family: number;
    description: string;
    id_shopping_list: number;
  }): Promise<FinanceExpenditure> {
    try {
      let expenditureType = await this.financeExpenditureTypeRepository.findOne(
        {
          where: [
            { id_family: data.id_family, expense_type_name: 'Shopping' },
            { id_family: data.id_family, expense_type_name_vn: 'Mua sắm' },
          ],
        },
      );
      if (!expenditureType) {
        expenditureType = await this.financeExpenditureTypeRepository.save({
          id_family: 96,
          expense_type_name: 'Shopping',
          expense_type_name_vn: 'Mua sắm',
        });
      }
      const expenditure = await this.financeExpenditureRepository.save({
        id_family: data.id_family,
        description: data.description,
        amount: 0,
        id_shopping_list: data.id_shopping_list,
        id_expenditure_type: expenditureType.id_expenditure_type,
      });
      console.log('expenditure', expenditure);
      return expenditure;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
