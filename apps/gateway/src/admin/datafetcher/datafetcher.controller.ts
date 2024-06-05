import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from "@nestjs/common";
import { DatafetcherService } from "./datafetcher.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Admin, AdminGuard, JwtAuthGuard } from "../../utils";
import { GetListOrdersDto } from "./dto/getListOrders.dto";

@ApiTags('Admin Datafetcher')
@Controller()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Admin(true)
export class DatafetcherController {
  constructor(
    private readonly datafetcherService: DatafetcherService
  ) { }

  @ApiOperation({ summary: 'Get IP data' })
  @HttpCode(HttpStatus.OK)
  @Get('ipData/:ip')
  async getIpData(@Param('ip') ip: string) {
    return this.datafetcherService.getIpData(ip);
  }

  @ApiOperation({ summary: 'Get summary' })
  @HttpCode(HttpStatus.OK)
  @Get('summary')
  async getSummary() {
    return this.datafetcherService.getSummary();
  }

  @ApiOperation({ summary: 'Get revenue last 6 months' })
  @HttpCode(HttpStatus.OK)
  @Get('revenueLast6Months')
  async getRevenueLast6Months() {
    return this.datafetcherService.getRevenueLast6Months();
  }

  @ApiOperation({ summary: 'Get list orders' })
  @HttpCode(HttpStatus.OK)
  @Post('listOrders')
  async getListOrders(@Body() body: GetListOrdersDto) {
    return this.datafetcherService.getListOrders(body);
  }
}