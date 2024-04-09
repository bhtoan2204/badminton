import { HttpException, Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { PAYMENT_SERVICE } from "../utils";
import { lastValueFrom, timeout } from "rxjs";

@Injectable()
export class PaymentService {
  constructor(
    @Inject(PAYMENT_SERVICE) private paymentClient: ClientProxy
  ) { }

  async get_all_package() {
    try {
      const response = this.paymentClient.send('payment/get_all_package', {})
        .pipe(
          timeout(5000),
        );
      const data = await lastValueFrom(response);
      return data;
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
  async get_package(id_package) {
    try {
      const response = this.paymentClient.send('payment/get_package', { id_package })
        .pipe(
          timeout(5000),
        );
      const data = await lastValueFrom(response);
      return data;
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
  async get_method() {
    try {
      const response = this.paymentClient.send('payment/get_method', {})
        .pipe(
          timeout(5000),
        );
      const data = await lastValueFrom(response);
      return data;
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
  async get_order(id_user) {
    try {
      const response = this.paymentClient.send('payment/get_order', { id_user })
        .pipe(
          timeout(5000),
        );
      const data = await lastValueFrom(response);
      return data;
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async generateVnpay(id_user, order, ip) {
    try {
      const response = this.paymentClient.send('payment/generateVnpay', { id_user, ip, order })
        .pipe(
          timeout(5000),
        );
      const data = await lastValueFrom(response);
      return data;
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
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
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}