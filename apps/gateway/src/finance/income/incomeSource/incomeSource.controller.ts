import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { IncomeSourceService } from "./incomeSource.service";
import { CurrentUser } from "apps/gateway/src/utils";
import { JwtAuthGuard } from "../../../auth/guard/jwt-auth.guard";
import { CreateIncomeSourceDto } from "./dto/createIncomeSource.dto";
import { UpdateIncomeSourceDto } from "./dto/updateIncomeSource.dto";

@ApiTags('Income Source')
@Controller('finance/incomeSource')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class IncomeSourceController {
  constructor(private readonly incomeService: IncomeSourceService) { }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Income Source' })
  @Get('getIncomeSource/:id_family')
  async getIncomeSource(@CurrentUser() currentUser, @Param('id_family') id_family: number){
    return this.incomeService.getIncomeSource(currentUser.id_user, id_family);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create Income Source' })
  @Post('createIncomeSource')
  async createIncomeSource(@CurrentUser() currentUser, @Body() dto: CreateIncomeSourceDto) {
    return this.incomeService.createIncomeSource(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update Income Source' })
  @Put('updateIncomeSource')
  async updateIncomeSource(@CurrentUser() currentUser, @Body() dto: UpdateIncomeSourceDto) {
    return this.incomeService.updateIncomeSource(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete Income Source' })
  @Delete('deleteIncomeSource/:id_family/:id_income_source')
  async deleteIncomeSource(@CurrentUser() currentUser, @Param('id_income_source') id_income_source: number, @Param('id_family') id_family: number) {
    return this.incomeService.deleteIncomeSource(currentUser.id_user, id_family, id_income_source);
  }
}