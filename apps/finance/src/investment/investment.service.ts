import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";

@Injectable()
export class InvestmentService {
  constructor(
    private readonly entityManager: EntityManager,
  ) { }

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