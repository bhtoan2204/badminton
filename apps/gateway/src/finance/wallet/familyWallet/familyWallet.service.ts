import { HttpException, Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { FINANCE_SERVICE } from "../../../utils";
import { lastValueFrom, timeout } from "rxjs";

@Injectable()
export class FamilyWalletService {
  constructor(
    @Inject(FINANCE_SERVICE) private financeClient: ClientProxy
  ) {}
  
  async getFamilyWallet(id_user: string, id_family: number) {
    try {
      const response = this.financeClient.send('financeClient/getFamilyWallet', { id_user, id_family })
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

  async createFamilyWallet(id_user: string, dto: any) {
    try {
      const response = this.financeClient.send('financeClient/createFamilyWallet', { id_user, dto })
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

  async updateFamilyWallet(id_user: string, dto: any) {
    try {
      const response = this.financeClient.send('financeClient/updateFamilyWallet', { id_user, dto })
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

  async deleteFamilyWallet(id_user: string, id_family: number, id_wallet: number) {
    try {
      const response = this.financeClient.send('financeClient/deleteFamilyWallet', { id_user, id_family, id_wallet })
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