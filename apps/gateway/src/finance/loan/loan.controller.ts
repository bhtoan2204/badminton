import { Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";
import { LoanService } from "./loan.service";

@ApiTags('Loan')
@Controller('finance/loan')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class LoanController {
  constructor(private readonly loanService: LoanService) { }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Loan Type' })
  @Get('getLoanType')
  async getLoanType() {
    return this.loanService.getLoanCreditorType();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Loan' })
  @Get('getLoan')
  async getLoan() {
    return this.loanService.getLoan();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create Loan' })
  @Post('createLoan')
  async createLoan() {
    return this.loanService.createLoan();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update Loan' })
  @Put('updateLoan')
  async updateLoan() {
    return this.loanService.updateLoan();
  }

  @HttpCode(204)
  @ApiOperation({ summary: 'Delete Loan' })
  @Delete('deleteLoan')
  async deleteLoan() {
    return this.loanService.deleteLoan();
  }
}