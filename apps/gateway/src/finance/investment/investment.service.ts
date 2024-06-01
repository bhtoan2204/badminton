import { HttpException, Inject, Injectable } from "@nestjs/common";
import { FINANCE_SERVICE } from "../../utils";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom, timeout } from "rxjs";
import { CreateInvestmentDto } from "./dto/createInvestment.dto";

@Injectable()
export class InvestmentService {
  constructor(
    @Inject(FINANCE_SERVICE) private financeClient: ClientProxy
  ) { }

  async getInvestmentType() {
    try {
      const response = this.financeClient.send('financeClient/getInvestmentType', {})
        .pipe(
          timeout(15000),
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

  async getInvestmentRiskLevel() {
    try {
      const response = this.financeClient.send('financeClient/getInvestmentRiskLevel', {})
        .pipe(
          timeout(15000),
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

  async getInvestment() {
    return 'Investment';
  }

  async createInvestment(id_user, dto: CreateInvestmentDto) {
    try {
      const response = this.financeClient.send('financeClient/createInvestment', { id_user, dto })
        .pipe(
          timeout(15000),
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

  async updateInvestment() {
    return 'Investment updated';
  }

  async deleteInvestment() {
    return 'Investment deleted';
  }
}