import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PAYMENT_SERVICE } from '../utils';
import { lastValueFrom, timeout } from 'rxjs';
import { PackageType } from '@app/common';
import { OrderReturnDTO } from './dto/orderReturn.dto';

@Injectable()
export class PaymentService {
  constructor(@Inject(PAYMENT_SERVICE) private paymentClient: ClientProxy) {}

  async get_all_package() {
    try {
      const response = this.paymentClient
        .send('paymentClient/get_all_package', {})
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getMainPackage() {
    try {
      const response = this.paymentClient
        .send('paymentClient/getMainPackage', {})
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getExtraPackage() {
    try {
      const response = this.paymentClient
        .send('paymentClient/getExtraPackage', {})
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getComboPackage() {
    try {
      const response = this.paymentClient
        .send('paymentClient/getComboPackage', {})
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async placeOrder(id_user: string, order: any, ip: string) {
    try {
      const { id_combo_package, id_main_package, id_extra_package } = order;
      let packageType = null;
      if (id_main_package) {
        packageType = PackageType.MAIN;
      }
      if (id_extra_package) {
        packageType = PackageType.EXTRA;
      }
      if (id_combo_package) {
        packageType = PackageType.COMBO;
      }
      const response = this.paymentClient
        .send('paymentClient/placeOrder', { id_user, order, packageType, ip })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async get_package(id_package) {
    try {
      const response = this.paymentClient
        .send('paymentClient/get_package', { id_package })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
  async get_method() {
    try {
      const response = this.paymentClient
        .send('paymentClient/get_method', {})
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
  async get_order(id_user) {
    try {
      const response = this.paymentClient
        .send('paymentClient/get_order', { id_user })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async getAvailableFunction(id_user: string, id_family: number) {
    try {
      const response = this.paymentClient
        .send('paymentClient/getAvailableFunction', { id_user, id_family })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async generateVnpay(id_user, order, ip) {
    try {
      const response = this.paymentClient
        .send('paymentClient/generateVnpay', { id_user, ip, order })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async checkOrderReturn(id_user: string, orderReturn: OrderReturnDTO) {
    try {
      const response = this.paymentClient
        .send('paymentClient/checkOrderReturn', { id_user, orderReturn })
        .pipe(timeout(15000));
      const data = await lastValueFrom(response);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}
