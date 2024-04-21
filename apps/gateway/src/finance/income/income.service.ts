import { Inject, Injectable } from "@nestjs/common";
import { FINANCE_SERVICE } from "../../utils";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class IncomeService {
  constructor(
    @Inject(FINANCE_SERVICE) private financeClient: ClientProxy
  ) {}

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