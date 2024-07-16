import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PAYMENT_SERVICE } from '../utils';
import { VerifyOrderDTO } from './dto/verifyOrder.dto';
import { PackageType, RmqService } from '@app/common';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(PAYMENT_SERVICE) private paymentClient: ClientProxy,
    private readonly rmqService: RmqService,
  ) {}

  async getMainPackage() {
    try {
      return await this.rmqService.send(
        this.paymentClient,
        'paymentClient/getMainPackage',
        {},
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getExtraPackage() {
    try {
      return await this.rmqService.send(
        this.paymentClient,
        'paymentClient/getExtraPackage',
        {},
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getComboPackage() {
    try {
      return await this.rmqService.send(
        this.paymentClient,
        'paymentClient/getComboPackage',
        {},
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
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
      return await this.rmqService.send(
        this.paymentClient,
        'paymentClient/placeOrder',
        { id_user, order, packageType, ip },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async get_method() {
    try {
      return await this.rmqService.send(
        this.paymentClient,
        'paymentClient/get_method',
        {},
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getOrder(id_user: string, page: number, itemsPerPage: number) {
    try {
      return await this.rmqService.send(
        this.paymentClient,
        'paymentClient/getOrder',
        { id_user, page, itemsPerPage },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getAvailableFunction(id_user: string, id_family: number) {
    try {
      return await this.rmqService.send(
        this.paymentClient,
        'paymentClient/getAvailableFunction',
        { id_user, id_family },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async generateVnpay(id_user: string, order: any, ip: string) {
    try {
      return await this.rmqService.send(
        this.paymentClient,
        'paymentClient/generateVnpay',
        { id_user, ip, order },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async checkOrderReturn(id_user: string, dto: VerifyOrderDTO) {
    try {
      return await this.rmqService.send(
        this.paymentClient,
        'paymentClient/verifyOrder',
        { id_user, dto },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async paymentHistory(id_user: string, page: number, itemsPerPage: number) {
    try {
      return await this.rmqService.send(
        this.paymentClient,
        'paymentClient/paymentHistory',
        { id_user, page, itemsPerPage },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }
}
