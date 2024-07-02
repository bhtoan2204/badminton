import { Injectable, HttpStatus } from '@nestjs/common';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { sortObject } from './utils';
import * as moment from 'moment';
import * as crypto from 'crypto';
import * as qs from 'qs';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  Family,
  FamilyExtraPackages,
  FamilyRole,
  Feedback,
  FeedbackMetadata,
  FeedbackMetadataKey,
  MemberFamily,
  Order,
  OrderStatus,
  PackageCombo,
  PackageExtra,
  PackageMain,
  PackageType,
  PaymentHistory,
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
    @InjectDataSource() private readonly dataSource: DataSource,
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

  async checkOrder(id_user: string, dto: any) {
    const { id_order, bankCode, amount, id_family } = dto;

    try {
      const order = await this.orderRepository.findOne({
        where: {
          id_order,
          id_user,
          price: amount,
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
      console.log(newFamily);
      const memberFamily = new MemberFamily();
      memberFamily.id_user = order.id_user;
      memberFamily.role = FamilyRole.OWNER;
      memberFamily.id_family = newFamily.id_family;
      await this.memberFamilyRepository.save(memberFamily);
      order.id_family = family.id_family;
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
      console.log(order);
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
          id_package = extraPackage.id_extra_package;
          price = extraPackage.price;
          break;
        case PackageType.COMBO:
          const comboPackage = await this.packageComboRepository.findOne({
            where: { id_combo_package },
          });
          if (!comboPackage) {
            throw new RpcException({
              message: 'Combo package not found',
              statusCode: HttpStatus.NOT_FOUND,
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
      return this.generateOrderLink(
        id_package,
        packageType,
        id_user,
        id_family,
        order_id,
        price * 100,
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

  async paymentHistory(id_user: string, page: number, itemsPerPage: number) {
    try {
      const [data, total] = await this.paymentHistoryRepository.findAndCount({
        where: { id_user: id_user },
        order: { created_at: 'DESC' },
        skip: (page - 1) * itemsPerPage,
        take: itemsPerPage,
        relations: ['orders'],
      });
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
