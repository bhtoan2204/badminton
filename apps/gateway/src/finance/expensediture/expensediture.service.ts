import { Inject, Injectable } from "@nestjs/common";
import { FINANCE_SERVICE } from "../../utils";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class ExpenseditureService {
  constructor(
    @Inject(FINANCE_SERVICE) private financeClient: ClientProxy
  ) {}

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