import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  RemoveEvent,
  Repository,
  UpdateEvent,
} from 'typeorm';
import { FinanceExpenditure } from '../entity/finance_expenditure.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  ShoppingLists,
  ShoppingListsStatus,
} from '../entity/shopping_lists.entity';
import { ShoppingItems } from '../entity/shopping_items.entity';

@Injectable()
@EventSubscriber()
export class ShoppingListSubscriber
  implements EntitySubscriberInterface<ShoppingLists>
{
  expenditureRepository: Repository<FinanceExpenditure>;
  shoppingItemRepository: Repository<ShoppingItems>;
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.dataSource.subscribers.push(this);
    this.expenditureRepository =
      this.dataSource.getRepository(FinanceExpenditure);
    this.shoppingItemRepository = this.dataSource.getRepository(ShoppingItems);
  }

  listenTo() {
    return ShoppingLists;
  }

  private async calculateTotalAmount(id_list: number): Promise<number> {
    const shoppingItemRepository = this.dataSource.getRepository(ShoppingItems);
    const items = await shoppingItemRepository.find({ where: { id_list } });
    console.log(items);
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  async afterUpdate(event: UpdateEvent<ShoppingLists>): Promise<any> {
    const { entity, databaseEntity } = event;
    if (entity && databaseEntity) {
      const expenditure = await this.expenditureRepository.findOne({
        where: { id_shopping_list: entity.id_list },
      });
      if (entity.status === ShoppingListsStatus.COMPLETED) {
        expenditure.amount = await this.calculateTotalAmount(entity.id_list);
        expenditure.description = entity.description;
        expenditure.expenditure_date = entity.updated_at;
      } else if (entity.status === ShoppingListsStatus.IN_PROGRESS) {
        expenditure.amount = 0;
        expenditure.description = entity.description;
        expenditure.expenditure_date = entity.updated_at;
      }
      await this.expenditureRepository.save(expenditure);
    }
  }

  async afterRemove(event: RemoveEvent<ShoppingLists>): Promise<any> {
    const { entity } = event;
    if (entity) {
      const expenditure = await this.expenditureRepository.findOne({
        where: { id_shopping_list: entity.id_list },
      });
      if (expenditure) {
        await this.expenditureRepository.remove(expenditure);
      }
    }
  }
}
