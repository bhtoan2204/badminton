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
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CurrentUser, JwtAuthGuard } from '../utils';
import { VerifyOrderDTO } from './dto/verifyOrder.dto';
import { PlaceOrderDto } from './dto/placeOrder.dto';

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
    @Body() order: PlaceOrderDto,
    @Ip() ip: string,
  ) {
    const id_user = user.id_user;
    return this.paymentService.placeOrder(id_user, order, ip);
  }
  // --------------------------------------------------

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check order' })
  @Post('checkOrder')
  async checkOrderReturn(@CurrentUser() user, @Body() dto: VerifyOrderDTO) {
    const id_user = user.id_user;
    return this.paymentService.checkOrderReturn(id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get successful orders for current user' })
  @Get('getOrder')
  async get_order(@CurrentUser() user) {
    const id_user = user.id_user;
    return this.paymentService.get_order(id_user);
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
}
