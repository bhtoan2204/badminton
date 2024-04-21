import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";

@Injectable()
export class LoanService {
  constructor(
    private readonly entityManager: EntityManager,
  ) { }

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