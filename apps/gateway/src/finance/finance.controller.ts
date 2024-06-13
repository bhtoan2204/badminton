import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FinanceService } from './finance.service';
import {
  CurrentUser,
  JwtAuthGuard,
  MemberFamilyGuard,
  Permission,
  PERMISSION_FINANCE,
} from '../utils';

@ApiTags('Finance')
@Controller('finance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, MemberFamilyGuard)
@Permission([PERMISSION_FINANCE])
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get finance summary' })
  @Get('getSummary/:id_family')
  async getFinance(
    @CurrentUser() currentUser,
    @Param('id_family') id_family: number,
  ) {
    return this.financeService.getFinanceSummary(
      currentUser.id_user,
      id_family,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get expenditure last 30 days' })
  @Get('getExpenditure/:id_family')
  async getExpenditure(
    @CurrentUser() currentUser,
    @Param('id_family') id_family: number,
  ) {
    // return this.financeService.getExpenditure(currentUser.id_user, id_family);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get income last 30 days' })
  @Get('getIncome/:id_family')
  async getIncome(
    @CurrentUser() currentUser,
    @Param('id_family') id_family: number,
  ) {
    // return this.financeService.getIncome(currentUser.id_user, id_family);
  }
}
