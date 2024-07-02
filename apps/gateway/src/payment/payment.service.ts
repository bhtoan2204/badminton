import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PAYMENT_SERVICE } from '../utils';
import { lastValueFrom, timeout } from 'rxjs';
import { VerifyOrderDTO } from './dto/verifyOrder.dto';
import { PackageType } from '@app/common';

@Injectable()
export class PaymentService {
  constructor(@Inject(PAYMENT_SERVICE) private paymentClient: ClientProxy) {}

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
  async getOrder(id_user: string, page: number, itemsPerPage: number) {
    try {
      const response = this.paymentClient
        .send('paymentClient/getOrder', { id_user, page, itemsPerPage })
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

  async checkOrderReturn(id_user: string, dto: VerifyOrderDTO) {
    try {
      const response = this.paymentClient
        .send('paymentClient/verifyOrder', { id_user, dto })
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

  async paymentHistory(id_user: string, page: number, itemsPerPage: number) {
    try {
      const response = this.paymentClient
        .send('paymentClient/paymentHistory', { id_user, page, itemsPerPage })
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
