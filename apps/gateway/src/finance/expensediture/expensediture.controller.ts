import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";
import { ExpenseditureService } from "./expensediture.service";
import { CurrentUser } from "../../utils";
import { CreateExpenseDto } from "./dto/createExpense.dto";
import { UpdateExpenseDto } from "./dto/updateExpense.dto";

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
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'itemsPerPage', required: false })
  @Get('getExpense/:id_family')
  async getExpense(@CurrentUser() currentUser, @Query('page') page: number, @Query('itemsPerPage') itemsPerPage: number, @Param('id_family') id_family: number) {
    if (!page) page = 1;
    if (!itemsPerPage) itemsPerPage = 10;
    return this.expenseService.getExpensediture(currentUser.id_user, id_family, page, itemsPerPage);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get expenseditures by its id' })
  @Get('getExpenseById/:id_family/:id_expenditure')
  async getExpenseById(@CurrentUser() currentUser, @Param('id_family') id_family: number, @Param('id_expenditure') id_expenditure: number) {
    return this.expenseService.getExpenseditureById(currentUser.id_user, id_family, id_expenditure);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create expensediture' })
  @Post('createExpense')
  async createExpense(@CurrentUser() currentUser, @Body() dto: CreateExpenseDto) {
    return this.expenseService.createExpensediture(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update expensediture' })
  @Put('updateExpense')
  async updateExpense(@CurrentUser() currentUser, @Body() dto: UpdateExpenseDto) {
    return this.expenseService.updateExpensediture(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete expensediture' })
  @Delete('deleteExpense/:id_family/:id_income')
  async deleteExpense(@CurrentUser() currentUser, @Param('id_income') id_income: number, @Param('id_family') id_family: number) {
    return this.expenseService.deleteExpensediture(currentUser.id_user, id_family, id_income);
  }
}