import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  UseGuards,
  Ip,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CurrentUser, JwtAuthGuard } from '../utils';
import { VerifyOrderDTO } from './dto/verifyOrder.dto';
import { PlaceOrderDto } from './dto/placeOrder.dto';
import { GetPaymentHistoryDto } from './dto/getPaymentHistory.dto';

@ApiTags('Payment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get main package' })
  @Get('getMainPackage')
  async get_main_package() {
    return this.paymentService.getMainPackage();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get extra package' })
  @Get('getExtraPackage')
  async get_extra_package() {
    return this.paymentService.getExtraPackage();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get extra package' })
  @Get('getComboPackage')
  async get_combo_package() {
    return this.paymentService.getComboPackage();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get place order (main, combo, extra)' })
  @Post('placeOrder')
  async place_order(
    @CurrentUser() user,
    @Body() dto: PlaceOrderDto,
    @Ip() ip: string,
  ) {
    const id_user = user.id_user;
    return this.paymentService.placeOrder(id_user, dto, ip);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check order' })
  @Post('checkOrder')
  async checkOrderReturn(@CurrentUser() user, @Body() dto: VerifyOrderDTO) {
    const id_user = user.id_user;
    return this.paymentService.checkOrderReturn(id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get successful orders for current user' })
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiQuery({ name: 'itemsPerPage', required: true, type: Number })
  @Get('getOrder')
  async getOrder(
    @CurrentUser() user,
    @Query('page') page,
    @Query('itemsPerPage') itemsPerPage,
  ) {
    const id_user = user.id_user;
    return this.paymentService.getOrder(id_user, page, itemsPerPage);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get available function' })
  @Get('getAvailableFunction/:id_family')
  async getAvailableFunction(
    @CurrentUser() user,
    @Param('id_family') id_family: number,
  ) {
    const id_user = user.id_user;
    return this.paymentService.getAvailableFunction(id_user, id_family);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Payment History' })
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiQuery({ name: 'itemsPerPage', required: true, type: Number })
  @Get('paymentHistory')
  async paymentHistory(
    @CurrentUser() user,
    @Query() dto: GetPaymentHistoryDto,
  ) {
    const id_user = user.id_user;
    return this.paymentService.paymentHistory(id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get frequency question' })
  @Get('getFrequencyQuestion')
  async getFrequencyQuestion() {
    return this.paymentService.getFrequencyQuestion();
  }
}
