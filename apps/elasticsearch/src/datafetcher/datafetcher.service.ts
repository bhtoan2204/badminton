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
}
