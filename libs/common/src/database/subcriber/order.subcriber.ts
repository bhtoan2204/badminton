import {
  EventSubscriber,
  EntitySubscriberInterface,
  UpdateEvent,
  DataSource,
} from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Order, OrderStatus, PackageType, PaymentHistory } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
@EventSubscriber()
export class OrderSubscriber implements EntitySubscriberInterface<Order> {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.dataSource.subscribers.push(this);
  }

  listenTo() {
    return Order;
  }

  async afterUpdate(event: UpdateEvent<Order>) {
    const { entity, databaseEntity } = event;

    if (
      entity &&
      databaseEntity &&
      entity.status !== databaseEntity.status &&
      entity.status === OrderStatus.SUCCESS
    ) {
      const paymentHistoryRepo = this.dataSource.getRepository(PaymentHistory);

      const paymentHistory = paymentHistoryRepo.create({
        id_user: (entity as Order).id_user,
        id_order: (entity as Order).id_order,
        amount: (entity as Order).price,
        type: this.getPackageType(entity as Order),
        payment_method: (entity as Order).method,
      });

      await paymentHistoryRepo.save(paymentHistory);
    }
  }

  getPackageType(order: Order): PackageType {
    if (order.id_package_combo) {
      return PackageType.COMBO;
    } else if (order.id_package_extra) {
      return PackageType.EXTRA;
    } else if (order.id_package_main) {
      return PackageType.MAIN;
    }
    throw new Error('Invalid package type');
  }
}
