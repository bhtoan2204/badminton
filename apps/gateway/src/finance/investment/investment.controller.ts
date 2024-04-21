import { Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";
import { InvestmentService } from "./investment.service";

@ApiTags('Investment')
@Controller('finance/investment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class InvestmentController {
  constructor(private readonly InvestmentService: InvestmentService) { }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get investment' })
  @Get('getInvestment')
  async getInvestment() {
    return this.InvestmentService.getInvestment();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create investment' })
  @Post('createInvestment')
  async createInvestment() {
    return this.InvestmentService.createInvestment();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update investment' })
  @Put('updateInvestment')
  async updateInvestment() {
    return this.InvestmentService.updateInvestment();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete investment' })
  @Delete('deleteInvestment')
  async deleteInvestment() {
    return this.InvestmentService.deleteInvestment();
  }
}