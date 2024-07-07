import { Controller } from '@nestjs/common';
import { RmqService } from '@app/common';
import { AssetService } from './asset.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class AssetController {
  constructor(
    private readonly assetService: AssetService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('financeClient/getAsset')
  async getAsset(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.assetService.getAsset(
      data.id_user,
      data.id_family,
      data.page,
      data.itemsPerPage,
    );
  }

  @EventPattern('financeClient/createAsset')
  async createAsset(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.assetService.createAsset(
      data.id_user,
      data.dto,
      data.file,
    );
  }

  @EventPattern('financeClient/updateAsset')
  async updateAsset(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.assetService.updateAsset(
      data.id_user,
      data.dto,
      data.file,
    );
  }

  @EventPattern('financeClient/deleteAsset')
  async deleteAsset(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.assetService.deleteAsset(
      data.id_user,
      data.id_family,
      data.id_asset,
    );
  }
}
