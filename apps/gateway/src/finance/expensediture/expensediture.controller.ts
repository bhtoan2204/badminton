import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
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
  @ApiOperation({ summary: 'Get expenseditures by day' })
  @Get('getExpenseByDate/:id_family/:date')
  async getExpenseByDate(@CurrentUser() currentUser,  @Param('id_family') id_family: number,  @Param('date') date: string ) {
  return this.expenseService.getExpenseByDate(currentUser.id_user, id_family, date);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get expenseditures by month' })
  @Get('getExpenseByMonth/:id_family/:month/:year')
  async getExpenseByMonth(@CurrentUser() currentUser,  @Param('id_family') id_family: number,  @Param('month') month: number,  @Param('year') year: number)  {
  return this.expenseService.getExpenseByMonth(currentUser.id_user, id_family, month, year);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get expenseditures by year' })
  @Get('getExpenseByYear/:id_family/:year')
  async getExpenseByYear(@CurrentUser() currentUser, @Param('id_family') id_family: number,  @Param('year') year: number) {
  return this.expenseService.getExpenseByYear(currentUser.id_user, id_family, year);
  }
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Get expenseditures by its id' })
  // @Get('getExpenseById/:id_family/:id_expenditure')
  // async getExpenseById(@CurrentUser() currentUser, @Param('id_family') id_family: number, @Param('id_expenditure') id_expenditure: number) {
  //   return this.expenseService.getExpenseditureById(currentUser.id_user, id_family, id_expenditure);
  // }

  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Get statiscal expenseditures last six months' })
  // @Get('getStatiscalExpense/:id_family')
  // async getStatiscalExpense(@CurrentUser() currentUser, @Param('id_family') id_family: number) {
  //   return this.expenseService.getStatiscalExpensediture(currentUser.id_user, id_family);
  // }

  @HttpCode(HttpStatus.CREATED)
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

  @HttpCode(204)
  @ApiOperation({ summary: 'Delete expensediture' })
  @Delete('deleteExpense/:id_family/:id_income')
  async deleteExpense(@CurrentUser() currentUser, @Param('id_income') id_income: number, @Param('id_family') id_family: number) {
    return this.expenseService.deleteExpensediture(currentUser.id_user, id_family, id_income);
  }
}