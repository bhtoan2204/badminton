import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';
import { ProxyService } from "./proxy.service";

@Controller()
export class ProxyController {
  constructor(
    private readonly proxyService: ProxyService,
    private readonly rmqService: RmqService
  ) {}

  @EventPattern('proxyClient/getZone')
  async getZone(@Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.proxyService.getZone();
  }
}