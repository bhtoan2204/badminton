import { RmqService } from '@app/common';
import { Controller } from '@nestjs/common';
import { PackageMainService } from './packageMain.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class PackageMainController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly invoiceService: PackageMainService,
  ) {}

  @EventPattern('elasticsearchClient/getAllPackageMain')
  async getAllPackage(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.invoiceService.getAllPackageMain(
      data.page,
      data.itemsPerPage,
      data.search,
      data.sortBy,
      data.sortDesc,
    );
  }

  @EventPattern('elasticsearchClient/createPackageMain')
  async createPackage(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.invoiceService.createPackageMain(data);
  }

  @EventPattern('elasticsearchClient/updatePackageMain')
  async updatePackage(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.invoiceService.updatePackageMain(data);
  }

  @EventPattern('elasticsearchClient/deletePackageMain')
  async deletePackage(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.invoiceService.deletePackageMain(data.id_main_package);
  }
}
