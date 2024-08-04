import { Injectable } from '@nestjs/common';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  Repository,
} from 'typeorm';
import { Family } from '../entity/family.entity';
import { FinanceExpenditureType } from '../entity/finance_expenditure_type.entity';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
@EventSubscriber()
export class FamilySubscriber implements EntitySubscriberInterface<Family> {
  expenseTypeRepository: Repository<FinanceExpenditureType>;
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.dataSource.subscribers.push(this);
    this.expenseTypeRepository = this.dataSource.getRepository(
      FinanceExpenditureType,
    );
  }

  listenTo() {
    return Family;
  }

  async afterInsert(event: InsertEvent<Family>): Promise<any> {
    const { entity } = event;
    if (entity) {
      const utilitiesExpenseType = this.expenseTypeRepository.create({
        id_family: entity.id_family,
        expense_type_name: 'Utilities',
      });
      const shoppingExpenseType = this.expenseTypeRepository.create({
        id_family: entity.id_family,
        expense_type_name: 'Shopping',
      });
      await this.expenseTypeRepository.save([
        utilitiesExpenseType,
        shoppingExpenseType,
      ]);
    }
  }
}
