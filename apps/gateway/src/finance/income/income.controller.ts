import { Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";
import { IncomeService } from "./income.service";

@ApiTags('Income')
@Controller('finance/income')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) { }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Income' })
  @Get('getIncome')
  async getIncome() {
    return this.incomeService.getIncome();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create Income' })
  @Post('createIncome')
  async createIncome() {
    return this.incomeService.createIncome();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update Income' })
  @Put('updateIncome')
  async updateIncome() {
    return this.incomeService.updateIncome();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete Income' })
  @Delete('deleteIncome')
  async deleteIncome() {
    return this.incomeService.deleteIncome();
  }
}