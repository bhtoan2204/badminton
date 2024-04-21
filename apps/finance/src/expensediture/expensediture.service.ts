import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";

@Injectable()
export class ExpenseditureService {
  constructor(
    private readonly entityManager: EntityManager,
  ) { }

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