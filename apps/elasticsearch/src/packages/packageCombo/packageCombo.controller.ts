import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { PackageComboService } from './packageCombo.service';
import { RmqService } from '@app/common';

@Controller()
export class PackageComboController {
  constructor(
    private readonly packageComboService: PackageComboService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('elasticsearchClient/getPackagesCombo')
  async getPackagesCombo(
    @Ctx() context: RmqContext,
    @Payload() data: any,
  ): Promise<any> {
    this.rmqService.ack(context);
    return this.packageComboService.getPackagesCombo(
      data.page,
      data.itemsPerPage,
      data.search,
      data.sortBy,
      data.sortDesc,
    );
  }

  @EventPattern('elasticsearchClient/createPackageCombo')
  async createPackageCombo(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<any> {
    this.rmqService.ack(context);
    return this.packageComboService.createPackageCombo(data);
  }

  @EventPattern('elasticsearchClient/updatePackageCombo')
  async updatePackageCombo(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<any> {
    this.rmqService.ack(context);
    return this.packageComboService.updatePackageCombo(
      data.id_combo_package,
      data.dto,
    );
  }
}
