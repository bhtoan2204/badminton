import { Injectable } from '@nestjs/common';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  Repository,
  UpdateEvent,
} from 'typeorm';
import { Utilities } from '../entity/utilities.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { FinanceExpenditure } from '../entity/finance_expenditure.entity';

@Injectable()
@EventSubscriber()
export class UtilitiesSubcriber
  implements EntitySubscriberInterface<Utilities>
{
  expenditureRepository: Repository<FinanceExpenditure>;
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.dataSource.subscribers.push(this);
    this.expenditureRepository =
      this.dataSource.getRepository(FinanceExpenditure);
  }
  listenTo() {
    return Utilities;
  }

  async afterUpdate(event: UpdateEvent<Utilities>): Promise<any> {
    const { entity, databaseEntity } = event;
    if (entity && databaseEntity) {
      const expenditure = await this.expenditureRepository.findOne({
        where: { id_expenditure: entity.id_expenditure },
      });
      if (expenditure) {
        expenditure.amount = entity.value;
        expenditure.image_url = entity.image_url;
        expenditure.description = entity.description;
        expenditure.expenditure_date = entity.created_at;
        await this.expenditureRepository.save(expenditure);
      } else {
        const newExpenditure = this.expenditureRepository.create({
          id_family: entity.id_family,
          amount: entity.value,
          image_url: entity.image_url,
          description: entity.description,
          expenditure_date: new Date(),
        });
        await this.expenditureRepository.save(newExpenditure);
        entity.id_expenditure = newExpenditure.id_expenditure;
        await event.manager.save(entity);
      }
    }
  }

  async afterInsert(event: InsertEvent<Utilities>): Promise<any> {
    const { entity } = event;
    if (entity) {
      const newExpenditure = this.expenditureRepository.create({
        id_family: entity.id_family,
        amount: entity.value,
        image_url: entity.image_url,
        description: entity.description,
        expenditure_date: entity.created_at,
      });
      await this.expenditureRepository.save(newExpenditure);
      entity.id_expenditure = newExpenditure.id_expenditure;
      await event.manager.save(entity);
    }
  }
}
