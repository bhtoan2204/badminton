import { Controller, Get } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Gateway')
@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) { }

  @Get()
  async getHello() {
    return this.gatewayService.getHello();
  }
}
