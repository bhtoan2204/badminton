import { Controller, Get, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FinanceService } from "./finance.service";

@ApiTags('Finance')
@Controller('finance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class FinanceController {
  constructor( private readonly financeService: FinanceService ) { }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get finance summary' })
  @Get('getSummary')
  async getFinance() {
    // return this.financeService.getFinance();
  }

}