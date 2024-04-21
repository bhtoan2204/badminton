import { Inject, Injectable } from "@nestjs/common";
import { FINANCE_SERVICE } from "../../utils";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class LoanService {
  constructor(
    @Inject(FINANCE_SERVICE) private financeClient: ClientProxy
  ) {}

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