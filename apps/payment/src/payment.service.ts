import { Injectable , HttpException} from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class PaymentService {
  constructor(
    private readonly entityManager: EntityManager
) {}

  async get_package(){
    try {
      const Query = 'SELECT * from v_package';
      const data = await this.entityManager.query(Query);
      return data;
    } catch (error) {
      throw new HttpException(error, error.statusCode);
    }
  }
  async create_order(id_user, id_package) {
    try {
      const Query = 'SELECT * FROM f_create_order($1,$2)';
      const params = [id_user, id_package]; 
      const data = await this.entityManager.query(Query, params);
      return data[0]['f_create_order'];
    } catch (error) {
      throw new HttpException(error, error.statusCode);
    }
  }

  async check_order(id_user, OrderReturn){
    const {id_order , amount, vnp_ResponseCode, vnp_TransactionStatus} = OrderReturn;
    try {
    
      const Query = 'select * from f_check_order($1, $2, $3, $4, $5)';
      const params = [id_user, id_order, amount, vnp_ResponseCode, vnp_TransactionStatus]; 
      const data = await this.entityManager.query(Query, params);
      return data[0]['f_check_order'];
    } catch (error) {
      throw new HttpException(error, error.statusCode);
    }
  }
}