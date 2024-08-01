import { Injectable, HttpStatus } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { sortObject } from './utils';
import * as moment from 'moment';
import * as crypto from 'crypto';
import * as qs from 'qs';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Discount,
  Family,
  FamilyExtraPackages,
  FamilyRole,
  Feedback,
  FeedbackMetadata,
  FeedbackMetadataKey,
  FrequentlyQuestionMetaData,
  MemberFamily,
  Order,
  OrderStatus,
  PackageCombo,
  PackageExtra,
  PackageMain,
  PackageType,
  PaymentHistory,
} from '@app/common';
import { FinanceService } from './finance/finance.service';

@Injectable()
export class PaymentService {
  private readonly vnpTmnCode: string;
  private readonly vnpHashSecret: string;
  private readonly vnpUrl: string;
  private readonly vnpReturnUrl: string;

  constructor(
    private readonly financeService: FinanceService,
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
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Family)
    private familyRepository: Repository<Family>,
    @InjectRepository(FamilyExtraPackages)
    private familyExtraRepository: Repository<FamilyExtraPackages>,
    @InjectRepository(MemberFamily)
    private memberFamilyRepository: Repository<MemberFamily>,
    @InjectRepository(PaymentHistory)
    private paymentHistoryRepository: Repository<PaymentHistory>,
    @InjectRepository(Discount)
    private discountRepository: Repository<Discount>,
    @InjectRepository(FrequentlyQuestionMetaData)
    private frequentlyQuestionMetaDataRepository: Repository<FrequentlyQuestionMetaData>,
  ) {
    this.vnpTmnCode = this.configService.get<string>('VNPAY_TMN_CODE');
    this.vnpHashSecret = this.configService.get<string>('VNPAY_HASH_SECRET');
    this.vnpUrl = this.configService.get<string>('VNPAY_URL');
    this.vnpReturnUrl = this.configService.get<string>('VNPAY_RETURN_URL');
  }

  async getOrder(id_user: string, page: number, itemsPerPage: number) {
    try {
      const [data, total] = await this.orderRepository.findAndCount({
        where: { id_user: id_user },
        order: { created_at: 'DESC' },
        skip: (page - 1) * itemsPerPage,
        take: itemsPerPage,
      });
      return {
        data: data,
        total: total,
        message: 'Order fetched successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getAvailableFunction(id_user: string, id_family: number) {
    try {
      const familyExtra = await this.familyExtraRepository.find({
        where: { id_family: id_family },
        relations: ['extra_package'],
      });

      if (!familyExtra.length) {
        throw new RpcException({
          message: 'Family not found or not buy any extra package yet',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }

      const extraPackages = familyExtra.map((item) => {
        return {
          id_extra_package: item.extra_package.id_extra_package,
          name: item.extra_package.name,
          description: item.extra_package.description,
        };
      });
      return {
        data: {
          id_family: id_family,
          extra_packages: extraPackages,
        },
        message: 'Get available function',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async addDefaultExpenseIncomeType(id_family: number) {
    try {
      const [expenseType, incomeType] = await Promise.all([
        this.financeService.addDefaultExpenseType(id_family),
        this.financeService.addDefaultIncomeSource(id_family),
      ]);
      return { expenseType, incomeType };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async checkOrder(id_user: string, dto: any) {
    const { id_order, bankCode, id_family } = dto;

    try {
      const order = await this.orderRepository.findOne({
        where: {
          id_order,
          id_user,
          id_family,
          status: OrderStatus.PENDING,
          bank_code: bankCode,
        },
      });

      if (!order) {
        throw new RpcException({
          message: 'Order not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }

      await this.handleOrderStatus(order);

      return {
        data: order,
        message: 'Check order success',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  private async handleOrderStatus(order: Order) {
    if (order.status === OrderStatus.SUCCESS) {
      throw new RpcException({
        message: 'Order already paid',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    if (order.id_package_main) {
      await this.handleMainPackage(order);
    } else if (order.id_package_extra) {
      await this.handleExtraPackage(order);
    } else if (order.id_package_combo) {
      await this.handleComboPackage(order);
    } else {
      throw new RpcException({
        message: 'Invalid order package',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    order.status = OrderStatus.SUCCESS;
    await this.orderRepository.save(order);
    const familyExtraPackages = await this.familyExtraRepository.create({
      id_family: order.id_family,
      id_extra_package: 4,
    });
    await this.familyExtraRepository.save(familyExtraPackages);
  }

  private async handleMainPackage(order: Order) {
    const mainPackage = await this.packageMainRepository.findOne({
      where: { id_main_package: order.id_package_main },
    });

    if (order.id_family) {
      const family = await this.familyRepository.findOne({
        where: { id_family: order.id_family },
      });
      family.expired_at = moment(family.expired_at)
        .add(mainPackage.duration_months, 'months')
        .toDate();
      await this.familyRepository.save(family);
    } else {
      const family = new Family();
      family.quantity = 1;
      family.owner_id = order.id_user;
      family.expired_at = moment()
        .add(mainPackage.duration_months, 'months')
        .toDate();
      const newFamily = await this.familyRepository.save(family);
      const memberFamily = new MemberFamily();
      memberFamily.id_user = order.id_user;
      memberFamily.role = FamilyRole.OWNER;
      memberFamily.id_family = newFamily.id_family;
      await this.memberFamilyRepository.save(memberFamily);
      order.id_family = family.id_family;
      await this.addDefaultExpenseIncomeType(family.id_family);
    }
  }

  private async handleExtraPackage(order: Order) {
    if (order.id_family) {
      const familyExtra = new FamilyExtraPackages();
      familyExtra.id_family = order.id_family;
      familyExtra.id_extra_package = order.id_package_extra;
      await this.familyExtraRepository.save(familyExtra);
    } else {
      throw new RpcException({
        message: 'Order not found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
  }

  private async handleComboPackage(order: Order) {
    if (!order.id_family) {
      throw new RpcException({
        message: 'Order not found',
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    const packageCombo = await this.packageComboRepository.findOne({
      where: { id_combo_package: order.id_package_combo },
      relations: ['packageExtras'],
    });

    const familyExtras = packageCombo.packageExtras.map((item) => ({
      id_family: order.id_family,
      id_extra_package: item.id_extra_package,
    }));

    // Collect all ids for the packages
    const extraPackageIds = familyExtras.map((item) => item.id_extra_package);

    // Query the familyExtraRepository for all items with these ids
    const existingFamilyExtras = await this.familyExtraRepository.find({
      where: {
        id_family: order.id_family,
        id_extra_package: In(extraPackageIds),
      },
    });

    if (existingFamilyExtras.length > 0) {
      throw new RpcException({
        message: 'Family already bought one or more of these extra packages',
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    // Save new family extras if no existing packages found
    await this.familyExtraRepository.save(familyExtras);
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
        relations: ['packageExtras'],
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
    id_package: number,
    packageType: PackageType,
    id_user: string,
    id_family: number,
    orderId: string,
    price: number,
    ip: string,
    bankCode: string,
  ) {
    try {
      const vnp_Params = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: this.vnpTmnCode,
        vnp_Locale: 'vn',
        vnp_CurrCode: 'VND',
        vnp_TxnRef: orderId,
        vnp_OrderInfo: `Pay for transaction code: ${String(orderId)}`,
        vnp_OrderType: 'other',
        vnp_Amount: price * 100,
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

      const order = new Order();
      order.id_order = orderId;
      order.id_user = id_user;
      order.id_family = id_family;
      order.bank_code = bankCode;
      if (packageType === PackageType.MAIN) {
        order.id_package_main = id_package;
        order.id_package_combo = null;
        order.id_package_extra = null;
      } else if (packageType === PackageType.EXTRA) {
        order.id_package_main = null;
        order.id_package_combo = null;
        order.id_package_extra = id_package;
      } else if (packageType === PackageType.COMBO) {
        order.id_package_main = null;
        order.id_package_combo = id_package;
        order.id_package_extra = null;
      }
      order.price = price;
      await this.orderRepository.save(order);

      return `${this.vnpUrl}?${qs.stringify(sortedVnpParams, { encode: false })}`;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
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
      code,
    } = order;

    try {
      const family = await this.familyRepository.findOne({
        where: { id_family: id_family },
      });
      if (!family) {
        throw new RpcException({
          message: 'Family not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      let discount_rate = 0;
      if (code) {
        const discount = await this.discountRepository.findOne({
          where: { code: code },
        });
        if (!discount) {
          throw new RpcException({
            message: 'Discount code not found',
            statusCode: HttpStatus.NOT_FOUND,
          });
        }
        if (discount.expired_at < new Date()) {
          throw new RpcException({
            message: 'Discount code expired',
            statusCode: HttpStatus.BAD_REQUEST,
          });
        }
        discount_rate = discount.percentage;
      }
      const order_id = crypto.randomUUID();
      let price = null;
      let id_package = null;
      switch (packageType) {
        case PackageType.MAIN:
          const mainPackage = await this.packageMainRepository.findOne({
            where: { id_main_package },
          });
          if (!mainPackage) {
            throw new RpcException({
              message: 'Main package not found',
              statusCode: HttpStatus.NOT_FOUND,
            });
          }
          id_package = mainPackage.id_main_package;
          price = mainPackage.price;
          break;
        case PackageType.EXTRA:
          const extraPackage = await this.packageExtraRepository.findOne({
            where: { id_extra_package },
          });
          if (!extraPackage) {
            throw new RpcException({
              message: 'Extra package not found',
              statusCode: HttpStatus.NOT_FOUND,
            });
          }
          const familyExtra = await this.familyExtraRepository.findOne({
            where: { id_family, id_extra_package },
          });
          if (familyExtra) {
            throw new RpcException({
              message: 'Family already bought this extra package',
              statusCode: HttpStatus.BAD_REQUEST,
            });
          }
          id_package = extraPackage.id_extra_package;
          price = extraPackage.price;
          break;
        case PackageType.COMBO:
          const comboPackage = await this.packageComboRepository.findOne({
            where: { id_combo_package },
            relations: ['packageExtras'],
          });
          if (!comboPackage) {
            throw new RpcException({
              message: 'Combo package not found',
              statusCode: HttpStatus.NOT_FOUND,
            });
          }
          const familyExtras = comboPackage.packageExtras.map(
            (item) => item.id_extra_package,
          );
          const existingFamilyExtras = await this.familyExtraRepository.find({
            where: { id_family, id_extra_package: In(familyExtras) },
          });
          if (existingFamilyExtras.length > 0) {
            throw new RpcException({
              message:
                'Family already bought one or more of these extra packages',
              statusCode: HttpStatus.BAD_REQUEST,
            });
          }
          id_package = comboPackage.id_combo_package;
          price = comboPackage.price;
          break;
      }
      if (price === null) {
        throw new RpcException({
          message: 'Package not found',
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      const discountPrice = price - price * (discount_rate / 100);
      return this.generateOrderLink(
        id_package,
        packageType,
        id_user,
        id_family,
        order_id,
        discountPrice,
        ip,
        bankCode,
      );
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getListOrders(
    page: number,
    itemsPerPage: number,
    search: string | null,
    sortBy: string | null,
    sortDirection: 'ASC' | 'DESC' | null,
    type: 'ALL' | 'MAIN' | 'EXTRA' | 'COMBO',
  ) {
    try {
      const queryBuilder = this.orderRepository
        .createQueryBuilder('order')
        .leftJoinAndSelect('order.users', 'users')
        .leftJoinAndSelect('order.family', 'family')
        .leftJoinAndSelect('order.packageMain', 'packageMain')
        .leftJoinAndSelect('order.packageExtra', 'packageExtra')
        .leftJoinAndSelect('order.packageCombo', 'packageCombo')
        .skip((page - 1) * itemsPerPage)
        .take(itemsPerPage);

      if (search) {
        queryBuilder.andWhere(
          `order.method LIKE :search 
          OR users.email LIKE :search 
          OR users.phone LIKE :search 
          OR family.name LIKE :search 
          OR family.description LIKE :search`,
          { search: `%${search}%` },
        );
      }

      if (sortBy && sortDirection) {
        queryBuilder.orderBy(`order.${sortBy}`, sortDirection);
      }

      if (type !== 'ALL') {
        if (type === 'MAIN') {
          queryBuilder.andWhere('order.id_package_main IS NOT NULL');
        } else if (type === 'EXTRA') {
          queryBuilder.andWhere('order.id_package_extra IS NOT NULL');
        } else if (type === 'COMBO') {
          queryBuilder.andWhere('order.id_package_combo IS NOT NULL');
        }
      }

      const [data, total] = await queryBuilder.getManyAndCount();

      return {
        data,
        total,
        message: 'Get list orders successfully',
      };
    } catch (error) {
      throw new RpcException({
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'Internal server error',
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

  async calculateTotalRevenue(
    startDate: string,
    endDate: string,
  ): Promise<number> {
    const queryResult = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.price) AS total_revenue')
      .where('order.status = :status', { status: OrderStatus.SUCCESS })
      .andWhere('order.created_at >= :startDate', { startDate })
      .andWhere('order.created_at <= :endDate', { endDate })
      .getRawOne();

    return queryResult.total_revenue || 0;
  }

  async getOrderStatistics(data: {
    startDate: string;
    endDate: string;
    interval: number;
  }) {
    const { startDate, endDate, interval } = data;

    try {
      const intervalResults = [];
      const startMoment = moment(startDate);
      const endMoment = moment(endDate);
      const totalDuration = endMoment.diff(startMoment, 'seconds');
      const intervalDuration = totalDuration / interval;
      const promises = [];
      for (let i = 0; i < interval; i++) {
        const start = startMoment
          .clone()
          .add(intervalDuration * i, 'seconds')
          .format('YYYY-MM-DD HH:mm:ss');
        const end = startMoment
          .clone()
          .add(intervalDuration * (i + 1), 'seconds')
          .format('YYYY-MM-DD HH:mm:ss');

        const queryPromise = this.orderRepository
          .createQueryBuilder('order')
          .select('COUNT(order.id_order) AS total_orders')
          .addSelect('SUM(order.price) AS total_revenue')
          .where('order.status = :status', { status: OrderStatus.SUCCESS })
          .andWhere('order.created_at >= :startDate', { startDate: start })
          .andWhere('order.created_at < :endDate', { endDate: end })
          .getRawOne()
          .then((queryResult) => ({
            startDate: start,
            endDate: end,
            total_orders: parseInt(queryResult.total_orders) || 0,
            total_revenue: parseInt(queryResult.total_revenue) || 0,
          }));

        promises.push(queryPromise);
      }
      const results = await Promise.all(promises);
      intervalResults.push(...results);
      return {
        data: intervalResults,
        message: 'Order statistics fetched successfully',
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
      const totalFeedbacksByRating = await this.feedbackRepository
        .createQueryBuilder('feedback')
        .select('feedback.rating', 'rating')
        .addSelect('COUNT(feedback.rating)', 'count')
        .where('feedback.rating BETWEEN :minRating AND :maxRating', {
          minRating: 1,
          maxRating: 5,
        })
        .groupBy('feedback.rating')
        .getRawMany();
      const feedbackCounts = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };

      totalFeedbacksByRating.forEach((item) => {
        feedbackCounts[item.rating] = parseInt(item.count, 10);
      });

      return {
        data: result,
        totalFeedbacksByRating: totalFeedbacksByRating,
        message: 'Feedback fetched successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async paymentHistory(
    id_user: string,
    dto: {
      page: number;
      itemsPerPage: number;
      sortBy: string;
      sortDirection: 'ASC' | 'DESC';
    },
  ) {
    try {
      const option = {
        where: { id_user: id_user },
        skip: (dto.page - 1) * dto.itemsPerPage,
        take: dto.itemsPerPage,
        relations: ['orders'],
      };
      if (dto.sortBy && dto.sortDirection) {
        option['order'] = { [dto.sortBy]: dto.sortDirection };
      }
      const [data, total] =
        await this.paymentHistoryRepository.findAndCount(option);
      return {
        data: data,
        total: total,
        message: 'Payment history fetched successfully',
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
    rate: number,
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

      if (rate) {
        query.andWhere('feedbacks.rating = :rate', { rate: rate });
      }

      if (sortBy && sortDesc !== undefined) {
        const order = sortDesc === true ? 'DESC' : 'ASC';
        query.orderBy(`feedbacks.${sortBy}`, order);
      }
      const [data, total] = await query.getManyAndCount();
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

  async getFreqQuestion() {
    try {
      const data = await this.frequentlyQuestionMetaDataRepository.find();
      return {
        data: data,
        message: 'Feedback metadata fetched successfully',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
