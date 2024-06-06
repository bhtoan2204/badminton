import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InvestmentService } from './investment.service';
import { CurrentUser, JwtAuthGuard } from '../../utils';
import { CreateInvestmentDto } from './dto/createInvestment.dto';

@ApiTags('Investment')
@Controller('finance/investment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class InvestmentController {
  constructor(private readonly InvestmentService: InvestmentService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get investment type' })
  @Get('getInvestmentType')
  async getInvestmentType() {
    return this.InvestmentService.getInvestmentType();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get investment risk level' })
  @Get('getInvestmentRiskLevel')
  async getInvestmentRiskLevel() {
    return this.InvestmentService.getInvestmentRiskLevel();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get investment' })
  @Get('getInvestment')
  async getInvestment() {
    return this.InvestmentService.getInvestment();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create investment' })
  @Post('createInvestment')
  async createInvestment(
    @CurrentUser() currentUser,
    @Body() dto: CreateInvestmentDto,
  ) {
    return this.InvestmentService.createInvestment(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update investment' })
  @Put('updateInvestment')
  async updateInvestment() {
    return this.InvestmentService.updateInvestment();
  }

  @HttpCode(204)
  @ApiOperation({ summary: 'Delete investment' })
  @Delete('deleteInvestment')
  async deleteInvestment() {
    return this.InvestmentService.deleteInvestment();
  }
}
