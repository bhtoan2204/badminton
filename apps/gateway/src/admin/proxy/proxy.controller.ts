import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";
import { AdminGuard } from "../../auth/guard/authorize/role.guard";
import { Admin } from "../../utils";
import { ProxyService } from "./proxy.service";

@ApiTags('Admin Proxy')
@Controller('proxy')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Admin(true)
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) { }

  @HttpCode(HttpStatus.OK)
  @Get('getZone')
  async getZone() {
    return this.proxyService.getZone();
  }
}