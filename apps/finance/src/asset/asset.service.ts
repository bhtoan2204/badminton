import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { EntityManager } from 'typeorm';

@Injectable()
export class AssetService {
  constructor(private readonly entityManager: EntityManager) {}

  async getAsset(
    id_user: string,
    id_family: number,
    page: number,
    itemsPerPage: number,
  ) {
    try {
      const query = 'SELECT * FROM f_get_asset($1, $2, $3, $4)';
      const param = [id_user, id_family, page, itemsPerPage];
      const data = await this.entityManager.query(query, param);
      return data;
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async createAsset(id_user: string, dto: any) {
    const { id_family, name, description, value, purchase_date } = dto;
    try {
      const query = 'SELECT * FROM f_create_asset($1, $2, $3, $4, $5, $6)';
      const param = [
        id_user,
        id_family,
        name,
        description,
        value,
        purchase_date,
      ];
      const data = await this.entityManager.query(query, param);
      return {
        data: data[0],
        message: 'Asset created',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateAsset(id_user: string, dto: any) {
    const { id_asset, id_family, name, description, value, purchase_date } =
      dto;
    try {
      const query = 'SELECT * FROM f_update_asset($1, $2, $3, $4, $5, $6, $7)';
      const param = [
        id_user,
        id_asset,
        id_family,
        name,
        description,
        value,
        purchase_date,
      ];
      const data = await this.entityManager.query(query, param);
      return {
        data: data[0],
        message: 'Asset updated',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async deleteAsset(id_user: string, id_family, id_asset: number) {
    try {
      const query = 'SELECT * FROM f_delete_asset($1, $2, $3)';
      const param = [id_user, id_family, id_asset];
      const data = await this.entityManager.query(query, param);
      return {
        data: data[0].f_delete_asset,
        message: 'Asset deleted',
      };
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
