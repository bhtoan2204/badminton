import { HttpStatus, Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { EntityManager } from "typeorm";

@Injectable()
export class FamilyWalletCategoryService {
  constructor(
    private readonly entityManager: EntityManager,
  ) {}

  async getFamilyWalletCategories(id_user: string, id_family: number) {
    try {
      const query = 'SELECT * FROM f_get_family_wallet_categories($1, $2)';
      const params = [id_user, id_family];
      const data = await this.entityManager.query(query, params);
      return {
        data: data,
        message: 'Get income source',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async createFamilyWalletCategory(id_user: string, dto: any) {
    try {
      const { id_family, category_name, icon_url } = dto;
      const query = 'SELECT * FROM f_create_family_wallet_category($1, $2, $3, $4)';
      const params = [id_user, id_family, category_name, icon_url];
      const data = await this.entityManager.query(query, params);
      return {
        data: data,
        message: 'Create family wallet category',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async updateFamilyWalletCategory(id_user: string, dto: any) {
    try {
      const { id_wallet_category, id_family, category_name, icon_url } = dto;
      const query = 'SELECT * FROM f_update_family_wallet_category($1, $2, $3, $4, $5)';
      const params = [id_user, id_wallet_category, id_family, category_name, icon_url];
      const data = await this.entityManager.query(query, params);
      return {
        data: data,
        message: 'Update family wallet category',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async deleteFamilyWalletCategory(id_user: string, id_family: number, id_wallet_category: number) {
    try {
      const query = 'SELECT * FROM f_delete_family_wallet_category($1, $2, $3)';
      const params = [id_user, id_family, id_wallet_category];
      const data = await this.entityManager.query(query, params);
      return {
        data: data[0].f_delete_family_wallet_category,
        message: 'Delete family wallet category',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }
}