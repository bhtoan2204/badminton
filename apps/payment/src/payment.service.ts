import { Injectable, HttpStatus } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { sortObject } from './utils';
import * as moment from 'moment';
import * as crypto from 'crypto';
import * as qs from 'qs';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Feedback,
  FeedbackMetadata,
  FeedbackMetadataKey,
  PackageCombo,
  PackageExtra,
  PackageMain,
  PackageType,
} from '@app/common';

@Injectable()
export class PaymentService {
  private readonly vnpTmnCode: string;
  private readonly vnpHashSecret: string;
  private readonly vnpUrl: string;
  private readonly vnpReturnUrl: string;

  constructor(
    private readonly entityManager: EntityManager,
    private readonly configService: ConfigService,
    @InjectRepository(PackageMain)
    private packageMainRepository: Repository<PackageMain>,
    @InjectRepository(PackageExtra)
    private packageExtraRepository: Repository<PackageExtra>,
    @InjectRepository(PackageCombo)
    private packageComboRepository: Repository<PackageCombo>,
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
    @InjectRepository(FeedbackMetadata)
    private feedbackMetadataRepository: Repository<FeedbackMetadata>,
  ) {
    this.vnpTmnCode = this.configService.get<string>('VNPAY_TMN_CODE');
    this.vnpHashSecret = this.configService.get<string>('VNPAY_HASH_SECRET');
    this.vnpUrl = this.configService.get<string>('VNPAY_URL');
    this.vnpReturnUrl = this.configService.get<string>('VNPAY_RETURN_URL');
  }

  async get_all_package() {
    try {
      const Query = 'SELECT * from v_package';
      const data = await this.entityManager.query(Query);
      return data;
    } catch (error) {
      throw new RpcException({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
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
        message: error.message,
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
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
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
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
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
        message: 'Order created',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async check_order(id_user, orderReturn) {
    const { id_order, amount, vnp_ResponseCode, vnp_TransactionStatus } =
      orderReturn;
    try {
      const Query = 'select * from f_check_order($1, $2, $3, $4, $5)';
      const params = [
        id_user,
        id_order,
        amount,
        vnp_ResponseCode,
        vnp_TransactionStatus,
      ];
      const data = await this.entityManager.query(Query, params);
      return {
        data: data[0]['f_check_order'],
        message: 'Check order',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async generateVnpay(id_user, order, fullIp) {
    try {
      const orderId = await this.create_order(
        id_user,
        order.id_package,
        order.amount,
        order.method,
        order.id_family,
      );
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
        vnp_IpAddr: fullIp.split(':').pop(),
        vnp_CreateDate: moment().format('YYYYMMDDHHmmss'),
        ...(order.bankCode && { vnp_BankCode: order.bankCode }),
      };

      const sortedVnpParams = sortObject(vnp_Params);
      const signData = qs.stringify(sortedVnpParams, { encode: false });
      const hmac = crypto.createHmac('sha512', this.vnpHashSecret);
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
      sortedVnpParams['vnp_SecureHash'] = signed;

      return {
        isSuccess: true,
        paymentUrl: `${this.vnpUrl}?${qs.stringify(sortedVnpParams, { encode: false })}`,
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getMainPackage() {
    try {
      const [data, total] = await this.packageMainRepository.findAndCount({});
      return {
        data: data,
        total: total,
        message: 'Package fetched successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getExtraPackage() {
    try {
      const [data, total] = await this.packageExtraRepository.findAndCount({});
      return {
        data: data,
        total: total,
        message: 'Package fetched successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getComboPackage() {
    try {
      const [data, total] = await this.packageComboRepository.findAndCount({
        relations: ['id_package_extra'],
      });
      return {
        data: data,
        total: total,
        message: 'Package fetched successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async generateOrderLink(
    orderId: number,
    price: number,
    ip: string,
    bankCode: string,
  ) {
    const vnp_Params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.vnpTmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: `Pay for transaction code: ${String(orderId)}`,
      vnp_OrderType: 'other',
      vnp_Amount: price,
      vnp_ReturnUrl: `${this.vnpReturnUrl}${String(orderId)}`,
      vnp_IpAddr: ip.split(':').pop(),
      vnp_CreateDate: moment().format('YYYYMMDDHHmmss'),
      ...(bankCode && { vnp_BankCode: bankCode }),
    };

    const sortedVnpParams = sortObject(vnp_Params);
    const signData = qs.stringify(sortedVnpParams, { encode: false });
    const hmac = crypto.createHmac('sha512', this.vnpHashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    sortedVnpParams['vnp_SecureHash'] = signed;

    return `${this.vnpUrl}?${qs.stringify(sortedVnpParams, { encode: false })}`;
  }

  async placeOrder(
    id_user: string,
    order: any,
    packageType: PackageType,
    ip: string,
  ) {
    const {
      id_main_package,
      id_extra_package,
      id_combo_package,
      id_family,
      bankCode,
    } = order;

    try {
      // TODO: Create order
      console.log(id_family);
      const orderId = 1;
      let price = null;
      switch (packageType) {
        case PackageType.MAIN:
          const mainPackage = await this.packageMainRepository.findOne({
            where: { id_main_package },
          });
          console.log(mainPackage);
          price = mainPackage.price;
          break;
        case PackageType.EXTRA:
          const extraPackage = await this.packageExtraRepository.findOne({
            where: { id_extra_package },
          });
          price = extraPackage.price;
          break;
        case PackageType.COMBO:
          const comboPackage = await this.packageComboRepository.findOne({
            where: { id_combo_package },
          });
          console.log(comboPackage);
          price = comboPackage.price;
          break;
      }
      console.log(orderId, price, ip, bankCode);
      return this.generateOrderLink(orderId, Math.floor(price), ip, bankCode);
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async createFeedback(id_user: string, dto: any) {
    try {
      const { comment, rating } = dto;
      const feedback = new Feedback();
      feedback.comment = comment;
      feedback.rating = rating;
      feedback.id_user = id_user;
      const savedFeedback = await this.feedbackRepository.save(feedback);
      const feedbackMetadata = await this.feedbackMetadataRepository.findOne({
        where: { metadata_key: FeedbackMetadataKey },
      });
      if (!feedbackMetadata) {
        const metadata = new FeedbackMetadata();
        metadata.metadata_key = FeedbackMetadataKey;
        metadata.totalFeedbacks = 1;
        metadata.averageRating = rating;
        await this.feedbackMetadataRepository.save(metadata);
      } else {
        feedbackMetadata.averageRating =
          (feedbackMetadata.averageRating * feedbackMetadata.totalFeedbacks +
            rating) /
          (feedbackMetadata.totalFeedbacks + 1);
        feedbackMetadata.totalFeedbacks += 1;
        await this.feedbackMetadataRepository.save(feedbackMetadata);
      }
      return {
        data: savedFeedback,
        message: 'Feedback created successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getCountAndAverageRatingFeedback() {
    try {
      const result = await this.feedbackMetadataRepository.findOne({
        where: { metadata_key: FeedbackMetadataKey },
      });
      if (!result) {
        return {
          data: {
            metadata_key: FeedbackMetadataKey,
            totalFeedbacks: 0,
            averageRating: 0,
          },
          message: 'Feedback fetched successfully',
        };
      }
      return {
        data: result,
        message: 'Feedback fetched successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getFeedBack(
    page: number,
    itemsPerPage: number,
    search: string,
    sortBy: string,
    sortDesc: boolean,
  ) {
    try {
      const query = this.feedbackRepository
        .createQueryBuilder('feedbacks')
        .leftJoinAndSelect('feedbacks.user', 'users')
        .select([
          'feedbacks',
          'users.avatar',
          'users.firstname',
          'users.lastname',
        ])
        .take(itemsPerPage)
        .skip((page - 1) * itemsPerPage);

      if (search) {
        query.andWhere(
          'users.firstname LIKE :search OR users.lastname LIKE :search',
          { search: `%${search}%` },
        );
      }

      if (sortBy && sortDesc !== undefined) {
        query.orderBy(`feedbacks.${sortBy}`, sortDesc ? 'DESC' : 'ASC');
      }

      const [data, total] = await query.getManyAndCount();
      return {
        data: data,
        total: total,
        message: 'Feedback fetched successfully',
      };
      return {
        data: data,
        total: total,
        message: 'Feedback fetched successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
