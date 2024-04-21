import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";

@Injectable()
export class SavingService {
  constructor(
    private readonly entityManager: EntityManager,
  ) { }

  async getSaving() {
    return 'Saving';
  }

  async createSaving() {
    return 'Saving created';
  }

  async updateSaving() {
    return 'Saving updated';
  }

  async deleteSaving() {
    return 'Saving deleted';
  }
}