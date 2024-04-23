import { HttpStatus, Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { EntityManager } from "typeorm";

@Injectable()
export class InvestmentService {
  constructor(
    private readonly entityManager: EntityManager,
  ) { }

  async getInvestmentType() {
    try {
      const query = 'SELECT * FROM finance_investment_type';
      const data = await this.entityManager.query(query);
      return {
        data: data,
        message: 'Get investment type',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getInvestmentRiskLevel() {
    try {
      const query = 'SELECT * FROM finance_investment_risk_level';
      const data = await this.entityManager.query(query);
      return {
        data: data,
        message: 'Get investment risk level',
      }
    }
    catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }

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