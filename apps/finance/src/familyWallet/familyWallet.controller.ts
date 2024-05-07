import { Controller } from "@nestjs/common";
import { FamilyWalletService } from "./familyWallet.service";
import { RmqService } from "@app/common";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";

@Controller()
export class FamilyWalletController {
  constructor(
    private readonly familyWalletService: FamilyWalletService,
    private readonly rmqService: RmqService
  ) {}

  @EventPattern('financeClient/getFamilyWallet')
  async getFamilyWallet(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.familyWalletService.getFamilyWallet(data.id_user, data.id_family);
  }

  @EventPattern('financeClient/createFamilyWallet')
  async createFamilyWallet(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.familyWalletService.createFamilyWallet(data.id_user, data.dto);
  }

  @EventPattern('financeClient/updateFamilyWallet')
  async updateFamilyWallet(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.familyWalletService.updateFamilyWallet(data.id_user, data.dto);
  }

  @EventPattern('financeClient/deleteFamilyWallet')
  async deleteFamilyWallet(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.familyWalletService.deleteFamilyWallet(data.id_user, data.id_family, data.id_wallet);
  }
}