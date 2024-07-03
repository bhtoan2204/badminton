import { Family, Order, OrderStatus, Users } from '@app/common';
import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { EntityManager, IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class DatafetcherService {
  private readonly ip_api_url: string = null;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly entityManager: EntityManager,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Family)
    private readonly familyRepository: Repository<Family>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {
    this.ip_api_url = this.configService.get<string>('IP_API_URL');
  }

  async getIpData(ip: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.ip_api_url}${ip}`),
      );
      return response.data;
    } catch (error) {
      throw new RpcException({
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'Internal server error',
      });
    }
  }

  async getSummary() {
    try {
      const totalUsers = this.usersRepository.count();
      const totalFamilies = this.familyRepository.count();
      const totalOrderSuccess = this.orderRepository.count({
        where: { status: OrderStatus.SUCCESS },
      });
      const totalOrderPending = this.orderRepository.count({
        where: { status: OrderStatus.PENDING },
      });
      const totalOrderFailed = this.orderRepository.count({
        where: { status: OrderStatus.FAILED },
      });
      const totalRevenue = this.orderRepository.sum('price');
      const totalMainPackageOrderSuccess = this.orderRepository.count({
        where: { status: OrderStatus.SUCCESS, id_package_main: Not(IsNull()) },
      });
      const totalExtraPackageOrderSuccess = this.orderRepository.count({
        where: { status: OrderStatus.SUCCESS, id_package_extra: Not(IsNull()) },
      });
      const totalComboPackageOrderSuccess = this.orderRepository.count({
        where: { status: OrderStatus.SUCCESS, id_package_combo: Not(IsNull()) },
      });
      const [
        totalUsersCount,
        totalFamiliesCount,
        totalOrderSuccessCount,
        totalOrderPendingCount,
        totalOrderFailedCount,
        totalRevenueCount,
        totalMainPackageOrderSuccessCount,
        totalExtraPackageOrderSuccessCount,
        totalComboPackageOrderSuccessCount,
      ] = await Promise.all([
        totalUsers,
        totalFamilies,
        totalOrderSuccess,
        totalOrderPending,
        totalOrderFailed,
        totalRevenue,
        totalMainPackageOrderSuccess,
        totalExtraPackageOrderSuccess,
        totalComboPackageOrderSuccess,
      ]);

      return {
        data: {
          totalUsers: totalUsersCount,
          totalFamilies: totalFamiliesCount,
          totalOrderSuccess: totalOrderSuccessCount,
          totalOrderPending: totalOrderPendingCount,
          totalOrderFailed: totalOrderFailedCount,
          totalRevenue: totalRevenueCount,
          totalMainPackageOrderSuccess: totalMainPackageOrderSuccessCount,
          totalExtraPackageOrderSuccess: totalExtraPackageOrderSuccessCount,
          totalComboPackageOrderSuccess: totalComboPackageOrderSuccessCount,
        },
        message: 'Get summary successfully',
      };
    } catch (error) {
      throw new RpcException({
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'Internal server error',
      });
    }
  }

  async getRevenueLast6Months() {
    try {
      const query = 'SELECT * from f_get_monthly_revenue()';
      const response = await this.entityManager.query(query);
      return {
        data: response,
        message: 'Get revenue last 6 months successfully',
      };
    } catch (error) {
      throw new RpcException({
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'Internal server error',
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
}
