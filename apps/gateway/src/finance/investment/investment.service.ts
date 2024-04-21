import { Inject, Injectable } from "@nestjs/common";
import { FINANCE_SERVICE } from "../../utils";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class InvestmentService {
  constructor(
    @Inject(FINANCE_SERVICE) private financeClient: ClientProxy
  ) {}

  async getInvestment() {
    return 'Investment';
  }

  async createInvestment() {
    return 'Investment created';
  }

  async updateInvestment() {
    return 'Investment updated';
  }

  async deleteInvestment() {
    return 'Investment deleted';
  }
}