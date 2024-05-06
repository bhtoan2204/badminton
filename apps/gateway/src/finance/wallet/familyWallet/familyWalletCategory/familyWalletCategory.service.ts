import { HttpException, Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { FINANCE_SERVICE } from "../../../../utils";
import { lastValueFrom, timeout } from "rxjs";

@Injectable()
export class FamilyWalletCategoryService {
  constructor(
    @Inject(FINANCE_SERVICE) private financeClient: ClientProxy
  ) {}
  
  async getFamilyWalletCategories(id_user: string, id_family: number) {
    try {
      const response = this.financeClient.send('financeClient/getFamilyWalletCategories', { id_user, id_family })
        .pipe(
          timeout(5000),
        );
      const data = await lastValueFrom(response);
      return data;
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async createFamilyWalletCategory(id_user: string, dto: any) {
    try {
      const response = this.financeClient.send('financeClient/createFamilyWalletCategory', { id_user, dto })
        .pipe(
          timeout(5000),
        );
      const data = await lastValueFrom(response);
      return data;
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async updateFamilyWalletCategory(id_user: string, dto: any) {
    try {
      const response = this.financeClient.send('financeClient/updateFamilyWalletCategory', { id_user, dto })
        .pipe(
          timeout(5000),
        );
      const data = await lastValueFrom(response);
      return data;
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async deleteFamilyWalletCategory(id_user: string, id_family: number, id_wallet_category: number) {
    try {
      const response = this.financeClient.send('financeClient/deleteFamilyWalletCategory', { id_user, id_wallet_category, id_family })
        .pipe(
          timeout(5000),
        );
      const data = await lastValueFrom(response);
      return data;
    }
    catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}