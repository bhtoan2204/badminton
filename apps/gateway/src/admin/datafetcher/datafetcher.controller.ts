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

  @HttpCode(HttpStatus.OK)
  @Get('summary')
  async getSummary() {
    return this.datafetcherService.getSummary();
  }

  @HttpCode(HttpStatus.OK)
  @Get('revenueLast6Months')
  async getRevenueLast6Months() {
    return this.datafetcherService.getRevenueLast6Months();
  }
}