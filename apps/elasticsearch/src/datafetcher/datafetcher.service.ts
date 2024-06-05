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

  async getListOrders(page: number, itemsPerPage: number, search: string, sort: string, packageId: number) {
    try {
      const baseQuery = `
        SELECT u.id_user, u.email, u.phone, u.firstname, u.lastname, u.avatar,
               o.id_order, o.id_package, o.status, o.created_at, o.updated_at, o.method, o.expired_at as package_expired_at,
               pk.name as package_name, pk.price as package_price
        FROM "order" o 
        JOIN package pk ON o.id_package = pk.id_package 
        JOIN users u ON o.id_user = u.id_user
      `;
      let whereClause = '';
      let sortClause = '';
      let limitClause = '';
      let offsetClause = '';

      if (search) {
        whereClause = `
          WHERE u.email LIKE '%${search}%' 
          OR u.phone LIKE '%${search}%' 
          OR u.firstname LIKE '%${search}%' 
          OR u.lastname LIKE '%${search}%'
        `;
      }

      if (packageId) {
        whereClause += (whereClause ? ' AND' : ' WHERE') + ` o.id_package = ${packageId}`;
      }

      if (sort) {
        const validSortColumns = ['created_at', 'updated_at', 'status'];
        if (validSortColumns.includes(sort)) {
          sortClause = ` ORDER BY ${sort}`;
        }
      }

      if (itemsPerPage > 0) {
        limitClause = ` LIMIT ${itemsPerPage}`;
      }
  
      if (page > 0) {
        const offset = (page - 1) * itemsPerPage;
        offsetClause = ` OFFSET ${offset}`;
      }

      const finalQuery = `
        ${baseQuery}
        ${whereClause}
        ${sortClause}
        ${limitClause}
        ${offsetClause}
      `;
      const response = await this.entityManager.query(finalQuery);
      return {
        data: response,
        message: 'List orders fetched successfully',
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