import { Injectable } from "@nestjs/common";

@Injectable()
export class FamilyWalletService {
  constructor() {}

  async getFamilyWalletCategories(id_user: string, id_family: number) {
    return { id_user, id_family };
  }

  async createFamilyWalletCategory(id_user: string, dto: any) {
    return { id_user, dto };
  }

  async updateFamilyWalletCategory(id_user: string, dto: any) {
    return { id_user, dto };
  }
}