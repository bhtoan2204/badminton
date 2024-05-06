import { Controller } from "@nestjs/common";
import { FamilyWalletCategoryService } from "./familyWalletCategory.service";
import { RmqService } from "@app/common";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";

@Controller()
export class FamilyWalletCategoryController {
  constructor(
    private readonly familyWalletCategoryService: FamilyWalletCategoryService,
    private readonly rmqService: RmqService
  ) {}

  @EventPattern('financeClient/getFamilyWalletCategories')
  async getFamilyWalletCategories(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.familyWalletCategoryService.getFamilyWalletCategories(data.id_user, data.id_family);
  }

  @EventPattern('financeClient/createFamilyWalletCategory')
  async createFamilyWalletCategory(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.familyWalletCategoryService.createFamilyWalletCategory(data.id_user, data.dto);
  }

  @EventPattern('financeClient/updateFamilyWalletCategory')
  async updateFamilyWalletCategory(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.familyWalletCategoryService.updateFamilyWalletCategory(data.id_user, data.dto);
  }

  @EventPattern('financeClient/deleteFamilyWalletCategory')
  async deleteFamilyWalletCategory(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.familyWalletCategoryService.deleteFamilyWalletCategory(data.id_user, data.id_family, data.id_wallet_category);
  }
}