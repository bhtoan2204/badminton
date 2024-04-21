import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";

@Injectable()
export class IncomeService {
  constructor(
    private readonly entityManager: EntityManager,
  ) { }

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