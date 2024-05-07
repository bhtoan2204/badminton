import { HttpStatus, Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { EntityManager } from "typeorm";

@Injectable()
export class FamilyWalletService {
  constructor(
    private readonly entityManager: EntityManager,
  ) {}

  async getFamilyWallet(id_user: string, id_family: number) {
    try {
      const query = 'SELECT * FROM f_get_family_wallet($1, $2)';
      const params = [id_user, id_family];
      const data = await this.entityManager.query(query, params);
      return {
        data: data,
        message: 'Get family wallet',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async createFamilyWallet(id_user: string, dto: any) {
    try {
      const { id_family, wallet_name, current_balance, id_wallet_category } = dto;
      const query = 'SELECT * FROM f_create_family_wallet($1, $2, $3, $4, $5)';
      const params = [id_user, id_family, wallet_name, current_balance, id_wallet_category];
      const data = await this.entityManager.query(query, params);
      return {
        data: data,
        message: 'Create family wallet',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async updateFamilyWallet(id_user: string, dto: any) {
    try {
      const { id_wallet, id_family, id_wallet_category, wallet_name, current_balance } = dto;
      const query = 'SELECT * FROM f_update_family_wallet($1, $2, $3, $4, $5, $6)';
      const params = [id_user, id_wallet, id_family, wallet_name, current_balance, id_wallet_category];
      const data = await this.entityManager.query(query, params);
      return {
        data: data,
        message: 'Update family wallet',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async deleteFamilyWallet(id_user: string, id_family: number, id_wallet: number) {
    try {
      const query = 'SELECT * FROM f_delete_family_wallet($1, $2, $3)';
      const params = [id_user, id_family, id_wallet];
      const data = await this.entityManager.query(query, params);
      return {
        data: data[0].f_delete_family_wallet,
        message: 'Delete family wallet',
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