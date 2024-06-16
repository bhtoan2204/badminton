import { Controller } from '@nestjs/common';
import { PackageExtraService } from './packageExtra.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Controller()
export class PackageExtraController {
  constructor(
    private readonly packageExtraService: PackageExtraService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('elasticsearchClient/getExtraPackage')
  async getPackagesExtra(@Ctx() context: RmqContext): Promise<any> {
    this.rmqService.ack(context);
    return this.packageExtraService.getPackagesExtra();
  }

  @EventPattern('elasticsearchClient/updateExtraPackage')
  async updatePackageExtra(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<any> {
    this.rmqService.ack(context);
    return this.packageExtraService.updatePackageExtra(data);
  }
}
