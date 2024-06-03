import { HttpService } from "@nestjs/axios";
import { HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RpcException } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { EntityManager } from "typeorm";

@Injectable()
export class DatafetcherService {
  private readonly ip_api_url: string = null;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly entityManager: EntityManager
  ) {
    this.ip_api_url = this.configService.get<string>('IP_API_URL');
  }

  async getIpData(ip: string) {
    try {
      const response = await firstValueFrom(this.httpService.get(`${this.ip_api_url}${ip}`));
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
      const query = 'SELECT * from f_get_summary()';
      const response = await this.entityManager.query(query);
      return {
        data: response,
        message: 'Summary fetched successfully',
      };
    }
    catch (error) {
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
    }
    catch (error) {
      throw new RpcException({
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'Internal server error',
      });
    }
  }
}