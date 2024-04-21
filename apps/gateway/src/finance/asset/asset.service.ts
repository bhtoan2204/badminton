import { Inject, Injectable } from "@nestjs/common";
import { FINANCE_SERVICE } from "../../utils";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class AssetService {
  constructor(
    @Inject(FINANCE_SERVICE) private financeClient: ClientProxy
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