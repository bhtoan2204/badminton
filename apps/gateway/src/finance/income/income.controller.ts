import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { IncomeService } from './income.service';
import {
  CurrentUser,
  FamilyTermCheckGuard,
  JwtAuthGuard,
  MemberFamilyGuard,
  Permission,
  PERMISSION_FINANCE,
} from '../../utils';
import { CreateIncomeDto } from './dto/createIncome.dto';
import { UpdateIncomeDto } from './dto/updateIncome.dto';
import { GetIncomeDto } from './dto/getIncome.dto';

@ApiTags('Income')
@Controller('finance/income')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, FamilyTermCheckGuard, MemberFamilyGuard)
@Permission([PERMISSION_FINANCE])
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Income by day' })
  @ApiParam({ name: 'id_family', required: true })
  @ApiQuery({ name: 'date', required: false })
  @Get('getIncomeByDate/:id_family')
  async getIncomeByDate(
    @CurrentUser() currentUser,
    @Param('id_family') id_family: number,
    @Query('date') date: string,
  ) {
    return this.incomeService.getIncomeByDate(
      currentUser.id_user,
      id_family,
      date,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Income by month' })
  @ApiParam({ name: 'id_family', required: true })
  @ApiQuery({ name: 'month', required: false })
  @ApiQuery({ name: 'year', required: false })
  @Get('getIncomeByMonth/:id_family')
  async getIncomeByMonth(
    @CurrentUser() currentUser,
    @Param('id_family') id_family: number,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    return this.incomeService.getIncomeByMonth(
      currentUser.id_user,
      id_family,
      month,
      year,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Income by year' })
  @ApiParam({ name: 'id_family', required: true })
  @ApiQuery({ name: 'year', required: false })
  @Get('getIncomeByYear/:id_family')
  async getIncomeByYear(
    @CurrentUser() currentUser,
    @Param('id_family') id_family: number,
    @Query('year') year: number,
  ) {
    return this.incomeService.getIncomeByYear(
      currentUser.id_user,
      id_family,
      year,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Income By Id' })
  @Get('getIncomeById/:id_family/:id_income')
  async getIncomeById(
    @CurrentUser() currentUser,
    @Param('id_income') id_income: number,
    @Param('id_family') id_family: number,
  ) {
    return this.incomeService.getIncomeById(
      currentUser.id_user,
      id_family,
      id_income,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get statiscal income' })
  @Get('getIncomeByDateRange')
  async getIncomeByDateRange(
    @CurrentUser() currentUser,
    @Query() dto: GetIncomeDto,
  ) {
    return this.incomeService.getIncomeByDateRange(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create Income' })
  @Post('createIncome')
  async createIncome(@CurrentUser() currentUser, @Body() dto: CreateIncomeDto) {
    return this.incomeService.createIncome(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update Income' })
  @Put('updateIncome')
  async updateIncome(@CurrentUser() currentUser, @Body() dto: UpdateIncomeDto) {
    return this.incomeService.updateIncome(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete Income' })
  @Delete('deleteIncome/:id_family/:id_income')
  async deleteIncome(
    @CurrentUser() currentUser,
    @Param('id_income') id_income: number,
    @Param('id_family') id_family: number,
  ) {
    return this.incomeService.deleteIncome(
      currentUser.id_user,
      id_family,
      id_income,
    );
  }
}
