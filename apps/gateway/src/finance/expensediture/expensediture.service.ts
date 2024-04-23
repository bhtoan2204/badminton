import { HttpException, Inject, Injectable } from "@nestjs/common";
import { FINANCE_SERVICE } from "../../utils";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom, timeout } from "rxjs";

@Injectable()
export class ExpenseditureService {
  constructor(
    @Inject(FINANCE_SERVICE) private financeClient: ClientProxy
  ) { }

  async getExpenseditureType() {
    try {
      const response = this.financeClient.send('financeClient/getExpenseditureType', {})
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

  async getExpensediture() {
    return 'Expensediture';
  }

  async createExpensediture() {
    return 'Expensediture created';
  }

  async updateExpensediture() {
    return 'Expensediture updated';
  }

  async deleteExpensediture() {
    return 'Expensediture deleted';
  }
}