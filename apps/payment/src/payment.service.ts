import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderDTO } from 'apps/gateway/src/payment/dto/paymentDTO.dto';
import { EntityManager } from 'typeorm';

@Injectable()
export class PaymentService {
  constructor(
    private readonly configService: ConfigService,
    private readonly entityManager: EntityManager
) {}

  async CreateOrder(user, order:OrderDTO) {
    try {
      const { id_package, amount } = order;
      const Query = 'SELECT * FROM f_create_order($1,$2,$3)';
      const params = [user.id_user, id_package, amount]; 
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
