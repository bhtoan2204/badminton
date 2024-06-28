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
}
