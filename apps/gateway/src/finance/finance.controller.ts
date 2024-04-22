import { Controller, Get, HttpCode, HttpStatus, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FinanceService } from "./finance.service";
import { CurrentUser } from "../utils";

@ApiTags('Finance')
@Controller('finance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class FinanceController {
  constructor( private readonly financeService: FinanceService ) { }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get finance summary' })
  @Get('getSummary/:id_family')
  async getFinance(@CurrentUser() currentUser, @Param('id_family') id_family: number) {
    return this.financeService.getFinanceSummary(currentUser.id_user, id_family);
  }
}