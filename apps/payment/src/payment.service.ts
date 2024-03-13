import { Injectable } from '@nestjs/common';
import { OrderDTO } from 'apps/gateway/src/payment/dto/order.dto';
import { EntityManager } from 'typeorm';

@Injectable()
export class PaymentService {
  constructor(
    private readonly entityManager: EntityManager
) {}

  async CreateOrder(id_user, id_package) {
    try {
      const Query = 'SELECT * FROM f_create_order($1,$2)';
      const params = [id_user, id_package]; 
      const data = await this.entityManager.query(Query, params);
      return data[0]['f_create_order'];
    } catch (error) {
      throw error;
    }
  }

  async UpdateStatus(orderId){
    try {
      const Query = 'call p_update_payment($1)';
      const params = [orderId]; 
      const data = await this.entityManager.query(Query, params);
      return data;
    } catch (error) {
      throw error;
    }
  }
}