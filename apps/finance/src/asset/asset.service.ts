import { Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";

@Injectable()
export class AssetService {
  constructor(
    private readonly entityManager: EntityManager,
  ) {}

  async getAsset() {
    return 'Asset';
  }

  async createAsset() {
    return 'Asset created';
  }

  async updateAsset() {
    return 'Asset updated';
  }

  async deleteAsset() {
    return 'Asset deleted';
  }
}