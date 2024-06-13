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
import {
  CurrentUser,
  JwtAuthGuard,
  MemberFamilyGuard,
  Permission,
  PERMISSION_FINANCE,
} from '../../utils';
import { CreateInvestmentDto } from './dto/createInvestment.dto';

@ApiTags('Investment')
@Controller('finance/investment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, MemberFamilyGuard)
@Permission([PERMISSION_FINANCE])
export class InvestmentController {
  constructor(private readonly investmentService: InvestmentService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get investment type' })
  @Get('getInvestmentType')
  async getInvestmentType() {
    return this.investmentService.getInvestmentType();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get investment risk level' })
  @Get('getInvestmentRiskLevel')
  async getInvestmentRiskLevel() {
    return this.investmentService.getInvestmentRiskLevel();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get investment' })
  @Get('getInvestment')
  async getInvestment() {
    return this.investmentService.getInvestment();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create investment' })
  @Post('createInvestment')
  async createInvestment(
    @CurrentUser() currentUser,
    @Body() dto: CreateInvestmentDto,
  ) {
    return this.investmentService.createInvestment(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update investment' })
  @Put('updateInvestment')
  async updateInvestment() {
    return this.investmentService.updateInvestment();
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete investment' })
  @Delete('deleteInvestment')
  async deleteInvestment() {
    return this.investmentService.deleteInvestment();
  }
}
