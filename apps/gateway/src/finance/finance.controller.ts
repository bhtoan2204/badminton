import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FinanceService } from './finance.service';
import {
  CurrentUser,
  FamilyTermCheckGuard,
  JwtAuthGuard,
  MemberFamilyGuard,
  Permission,
  PERMISSION_FINANCE,
} from '../utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileInterceptor } from '../utils/interceptor/imageFile.interceptor';

@ApiTags('Finance')
@Controller('finance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, FamilyTermCheckGuard, MemberFamilyGuard)
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
  @ApiOperation({ summary: 'Convert invoice image to json (for testing)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { invoiceImg: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(
    FileInterceptor(
      'invoiceImg',
      new ImageFileInterceptor().createMulterOptions(),
    ),
  )
  @Post('processInvoice')
  async processInvoice(@UploadedFile() file: Express.Multer.File) {
    return await this.financeService.processInvoice(file);
  }
}
