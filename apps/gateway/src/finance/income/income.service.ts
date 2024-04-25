import { HttpException, Inject, Injectable } from "@nestjs/common";
import { FINANCE_SERVICE } from "../../utils";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom, timeout } from "rxjs";

@Injectable()
export class IncomeService {
  constructor(
    @Inject(FINANCE_SERVICE) private financeClient: ClientProxy
  ) {}

  async getIncomeSource() {
    try {
      const response = this.financeClient.send('financeClient/getIncomeSource', {})
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

  async getIncome() {
    return 'Income';
  }

  async createIncome() {
    return 'Income created';
  }

  async updateIncome() {
    return 'Income updated';
  }

  async deleteIncome() {
    return 'Income deleted';
  }
  
}