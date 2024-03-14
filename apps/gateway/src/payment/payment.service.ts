import { HttpException, Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
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
      throw new HttpException(error, error.statusCode);
    }
  }

  async check_order_return(id_user, orderReturn) {
    try {
      const response = this.paymentClient.send('payment/check_order_return', { id_user, orderReturn })
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

  async generateVnpay(id_user, order: OrderDTO, ip) {
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
}