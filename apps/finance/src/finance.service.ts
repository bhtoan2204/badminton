import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class FinanceService {
  constructor(
    private readonly entityManager: EntityManager,
  ) { }

  getAllFinance(): string {
    return 'finance :D';
  }
}
