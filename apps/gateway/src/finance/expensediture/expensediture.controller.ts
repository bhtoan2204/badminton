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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ExpenseditureService } from './expensediture.service';
import {
  CurrentUser,
  FamilyTermCheckGuard,
  JwtAuthGuard,
  MemberFamilyGuard,
  Permission,
  PERMISSION_FINANCE,
} from '../../utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileInterceptor } from '../../utils/interceptor/imageFile.interceptor';
import { createExpenditureSchema } from './schema/createExpense.schema';
import { updateExpenseSchema } from './schema/updateExpense.schema';
import { GetExpenseDto } from './dto/getExpense.dto';

@ApiTags('Expensediture')
@Controller('finance/expensediture')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, FamilyTermCheckGuard, MemberFamilyGuard)
@Permission([PERMISSION_FINANCE])
export class ExpenseditureController {
  constructor(private readonly expenseService: ExpenseditureService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get expenseditures by date' })
  @ApiParam({ name: 'id_family', required: true })
  @ApiQuery({ name: 'date', required: false, type: Date })
  @Get('getExpenseByDate/:id_family')
  async getExpenseByDate(
    @CurrentUser() currentUser,
    @Param('id_family') id_family: number,
    @Query('date') date: Date,
  ) {
    return this.expenseService.getExpenseByDate(
      currentUser.id_user,
      id_family,
      date,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get expenseditures by month' })
  @ApiParam({ name: 'id_family', required: true })
  @ApiQuery({ name: 'month', required: false })
  @ApiQuery({ name: 'year', required: false })
  @Get('getExpenseByMonth/:id_family')
  async getExpenseByMonth(
    @CurrentUser() currentUser,
    @Param('id_family') id_family: number,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    return this.expenseService.getExpenseByMonth(
      currentUser.id_user,
      id_family,
      month,
      year,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get expenseditures by year' })
  @ApiParam({ name: 'id_family', required: true })
  @ApiQuery({ name: 'year', required: false })
  @Get('getExpenseByYear/:id_family')
  async getExpenseByYear(
    @CurrentUser() currentUser,
    @Param('id_family') id_family: number,
    @Query('year') year: number,
  ) {
    return this.expenseService.getExpenseByYear(
      currentUser.id_user,
      id_family,
      year,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get expenseditures by its id' })
  @Get('getExpenseById/:id_family/:id_expenditure')
  async getExpenseById(
    @CurrentUser() currentUser,
    @Param('id_family') id_family: number,
    @Param('id_expenditure') id_expenditure: number,
  ) {
    return this.expenseService.getExpenseditureById(
      currentUser.id_user,
      id_family,
      id_expenditure,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get statiscal expenseditures' })
  @Get('getExpenseByDateRange')
  async getExpenseByDateRange(
    @CurrentUser() currentUser,
    @Query() dto: GetExpenseDto,
  ) {
    return this.expenseService.getExpenseByDateRange(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create expensediture' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: createExpenditureSchema })
  @UseInterceptors(
    FileInterceptor(
      'expenseImg',
      new ImageFileInterceptor().createMulterOptions(),
    ),
  )
  @Post('createExpense')
  async createExpense(
    @CurrentUser() currentUser,
    @Body()
    dto: {
      id_family: number;
      id_expenditure_type: number;
      amount: number;
      description: string;
      expenditure_date: Date;
      id_created_by: string;
    },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.expenseService.createExpensediture(
      currentUser.id_user,
      dto,
      file,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update expensediture' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: updateExpenseSchema })
  @UseInterceptors(
    FileInterceptor(
      'expenseImg',
      new ImageFileInterceptor().createMulterOptions(),
    ),
  )
  @Put('updateExpense')
  async updateExpense(
    @CurrentUser() currentUser,
    @Body() dto: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.expenseService.updateExpensediture(
      currentUser.id_user,
      dto,
      file,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete expensediture' })
  @Delete('deleteExpense/:id_family/:id_expenditure')
  async deleteExpense(
    @CurrentUser() currentUser,
    @Param('id_expenditure') id_expenditure: number,
    @Param('id_family') id_family: number,
  ) {
    return this.expenseService.deleteExpensediture(
      currentUser.id_user,
      id_family,
      id_expenditure,
    );
  }
}
