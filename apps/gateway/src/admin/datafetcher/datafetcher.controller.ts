import { Controller, Get, HttpCode, HttpStatus, Param, UseGuards } from "@nestjs/common";
import { DatafetcherService } from "./datafetcher.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Admin, AdminGuard, JwtAuthGuard } from "../../utils";

@ApiTags('Admin Datafetcher')
@Controller()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Admin(true)
export class DatafetcherController {
  constructor(
    private readonly datafetcherService: DatafetcherService
  ) { }

  @HttpCode(HttpStatus.OK)
  @Get('ipData/:ip')
  async getIpData(@Param('ip') ip: string) {
    return this.datafetcherService.getIpData(ip);
  }
}