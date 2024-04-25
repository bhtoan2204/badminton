import { HttpException, Inject, Injectable } from "@nestjs/common";
import { FINANCE_SERVICE } from "../../utils";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom, timeout } from "rxjs";

@Injectable()
export class LoanService {
  constructor(
    @Inject(FINANCE_SERVICE) private financeClient: ClientProxy
  ) {}

  async getLoanCreditorType() {
    try {
      const response = this.financeClient.send('financeClient/getLoanCreditorType', {})
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

  async getLoan() {
    return 'Loan';
  }

  async createLoan() {
    return 'Loan created';
  }

  async updateLoan() {
    return 'Loan updated';
  }

  async deleteLoan() {
    return 'Loan deleted';
  }
}