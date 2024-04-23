import { Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";
import { ExpenseditureService } from "./expensediture.service";

@ApiTags('Expensediture')
@Controller('finance/expensediture')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ExpenseditureController {
  constructor(private readonly expenseService: ExpenseditureService ) { }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get expenseditures' })
  @Get('getExpenseType')
  async getExpenseType() {
    return this.expenseService.getExpenseditureType();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get expenseditures' })
  @Get('getExpense')
  async getExpense() {
    return this.expenseService.getExpensediture();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create expensediture' })
  @Post('createExpense')
  async createExpense() {
    return this.expenseService.createExpensediture();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update expensediture' })
  @Put('updateExpense')
  async updateExpense() {
    return this.expenseService.updateExpensediture();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete expensediture' })
  @Delete('deleteExpense')
  async deleteExpense() {
    return this.expenseService.deleteExpensediture();
  }
}