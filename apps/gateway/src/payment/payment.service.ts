import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { PAYMENT_SERVICE } from "../utils/constant/services.constant";
import { OrderDTO } from "./dto/order.dto";
import { lastValueFrom, timeout } from "rxjs";

@Injectable()
export class PaymentService {
  constructor(
    @Inject(PAYMENT_SERVICE) private paymentClient: ClientProxy
  ) { }

  async get_package() {
    try {
      const response = this.paymentClient.send('payment/get_package', {})
        .pipe(
          timeout(5000),
        );
    const data = await lastValueFrom(response);
    return data;
        }
        catch (error) {
          throw new RpcException({
            message: error.message,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR
          });
        }
      }
  async get_order(id_user) {
    try {
      const response = this.paymentClient.send('payment/get_order', {id_user})
        .pipe(
          timeout(5000),
        );
    const data = await lastValueFrom(response);
    return data;
        }
        catch (error) {
          throw new RpcException({
            message: error.message,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR
          });
        }
      }
  async create_order (id_user, id_package){
  try{
    const response = this.paymentClient.send('payment/create_order', {id_user,id_package} )
        .pipe(
          timeout(5000),
        );
      const data = await lastValueFrom(response);
      return data;
    }
    catch (error) {
      throw new HttpException(error, error.statusCode);
    }
  }

  async generateVnpay(id_user, order, ip) {
    try {
      const response = this.paymentClient.send('payment/generateVnpay', { id_user, ip, order } )
        .pipe(
          timeout(5000),
        );
      const data = await lastValueFrom(response);
      return data;
    }
    catch (error) {
      throw new HttpException(error, error.statusCode);
    }
  }

  async check_order_return(id_user, orderReturn){
    try{
      const response = this.paymentClient.send('payment/check_order_return', {id_user,orderReturn} )
          .pipe(
            timeout(5000),
          );
        const data = await lastValueFrom(response);
        return data;
      }
      catch (error) {
        throw new HttpException(error, error.statusCode);
      }
  }
}