import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { ShoppingItems } from '../entity/shopping_items.entity';
import {
  ShoppingLists,
  ShoppingListsStatus,
} from '../entity/shopping_lists.entity';
import { FinanceExpenditure } from '../entity/finance_expenditure.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
@EventSubscriber()
export class ShoppingItemSubscriber
  implements EntitySubscriberInterface<ShoppingItems>
{
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.dataSource.subscribers.push(this);
  }

  listenTo() {
    return ShoppingItems;
  }

  private async calculateTotalAmount(id_list: number): Promise<number> {
    const shoppingItemRepository = this.dataSource.getRepository(ShoppingItems);
    const items = await shoppingItemRepository.find({ where: { id_list } });
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  private async updateExpenditure(id_list: number): Promise<void> {
    const shoppingListRepository = this.dataSource.getRepository(ShoppingLists);
    const expenditureRepository =
      this.dataSource.getRepository(FinanceExpenditure);

    const shoppingList = await shoppingListRepository.findOne({
      where: { id_list },
      relations: ['shoppingItems'],
    });

    if (shoppingList) {
      const expenditure = await expenditureRepository.findOne({
        where: { id_shopping_list: id_list },
      });
      console.log('expenditure', expenditure);
      if (shoppingList.status === ShoppingListsStatus.COMPLETED) {
        if (expenditure) {
          expenditure.amount = await this.calculateTotalAmount(id_list);
          expenditure.expenditure_date = new Date();
          await expenditureRepository.save(expenditure);
        }
      } else if (shoppingList.status === ShoppingListsStatus.IN_PROGRESS) {
        if (expenditure) {
          expenditure.amount = 0;
          expenditure.expenditure_date = new Date();
          await expenditureRepository.save(expenditure);
        }
      }
    }
  }

  async afterInsert(event: InsertEvent<ShoppingItems>): Promise<any> {
    await this.updateExpenditure(event.entity.id_list);
  }

  async afterUpdate(event: UpdateEvent<ShoppingItems>): Promise<any> {
    if (event.entity) {
      await this.updateExpenditure(event.entity.id_list);
    }
  }

  async afterRemove(event: RemoveEvent<ShoppingItems>): Promise<any> {
    await this.updateExpenditure(event.entity.id_list);
  }
}
