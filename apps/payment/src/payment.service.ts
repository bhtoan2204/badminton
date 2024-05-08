import { Injectable, HttpStatus } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { sortObject } from '../utils';
import * as moment from 'moment';
import * as crypto from "crypto";
import * as qs from "qs";

@Injectable()
export class PaymentService {
  private readonly vnpTmnCode: string;
  private readonly vnpHashSecret: string;
  private readonly vnpUrl: string;
  private readonly vnpReturnUrl: string;

  constructor(
    private readonly entityManager: EntityManager,
    private readonly configService: ConfigService
  ) {
    this.vnpTmnCode = this.configService.get<string>("VNPAY_TMN_CODE");
    this.vnpHashSecret = this.configService.get<string>("VNPAY_HASH_SECRET");
    this.vnpUrl = this.configService.get<string>("VNPAY_URL");
    this.vnpReturnUrl = this.configService.get<string>("VNPAY_RETURN_URL");
  }

  async get_all_package() {
    try {
      const Query = 'SELECT * from v_package';
      const data = await this.entityManager.query(Query);
      return data;
    } catch (error) {
      throw new RpcException({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message
      });
    }
  }

  async get_package(id_package) {
    try {
      const Query = 'SELECT * from v_package where id_package=$1';
      const params = [id_package];
      const data = await this.entityManager.query(Query, params);
      return data;
    } catch (error) {
      throw new RpcException({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message
      });
    }
  }

  async get_method() {
    try {
      const Query = 'SELECT * from payment_method';
      const data = await this.entityManager.query(Query);
      return data;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }
  async get_order(id_user) {
    try {
      const Query = 'SELECT * FROM f_get_order_info($1)';
      const params = [id_user];
      const data = await this.entityManager.query(Query, params);
      return data;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }
  async create_order(id_user, id_package, amount, method, id_family) {
    try {
      const Query = 'SELECT * FROM f_create_order($1,$2,$3,$4, $5)';
      const params = [id_user, id_package, amount, method, id_family];
      const data = await this.entityManager.query(Query, params);
      return {
        data: data[0]['f_create_order'],
        message: 'Order created'
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async check_order(id_user, orderReturn) {
    const { id_order, amount, vnp_ResponseCode, vnp_TransactionStatus } = orderReturn;
    try {
      const Query = 'select * from f_check_order($1, $2, $3, $4, $5)';
      const params = [id_user, id_order, amount, vnp_ResponseCode, vnp_TransactionStatus];
      const data = await this.entityManager.query(Query, params);
      return {
        data: data[0]['f_check_order'],
        message: 'Check order'
      }
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async generateVnpay(id_user, order, fullIp) {
    try {
      const orderId = await this.create_order(id_user, order.id_package, order.amount, order.method, order.id_family);
      const vnp_Params = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: this.vnpTmnCode,
        vnp_Locale: order.language || 'vn',
        vnp_CurrCode: 'VND',
        vnp_TxnRef: orderId,
        vnp_OrderInfo: `Pay for transaction code: ${String(orderId)}`,
        vnp_OrderType: 'other',
        vnp_Amount: order.amount * 100,
        vnp_ReturnUrl: `${this.vnpReturnUrl}${String(orderId)}`,
        vnp_IpAddr: fullIp.split(":").pop(),
        vnp_CreateDate: moment().format('YYYYMMDDHHmmss'),
        ...(order.bankCode && { vnp_BankCode: order.bankCode })
      };

      const sortedVnpParams = sortObject(vnp_Params);
      const signData = qs.stringify(sortedVnpParams, { encode: false });
      const hmac = crypto.createHmac("sha512", this.vnpHashSecret);
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
      sortedVnpParams['vnp_SecureHash'] = signed;

      return {
        isSuccess: true,
        paymentUrl: `${this.vnpUrl}?${qs.stringify(sortedVnpParams, { encode: false })}`
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }
}