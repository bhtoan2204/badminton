import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  UseGuards,
  Ip,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { OrderDTO } from './dto/order.dto';
import { CurrentUser, JwtAuthGuard } from '../utils';
import { OrderReturnDTO } from './dto/OrderReturn.dto';
import { PlaceOrderDto } from './dto/placeOrder.dto';

@ApiTags('Payment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all package' })
  @Get('getAllPackage')
  async get_all_package() {
    return this.paymentService.get_all_package();
  }

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
  @ApiOperation({ summary: 'Get package' })
  @Get('getPackage')
  async get_package(@Query('id_package') id_package: number) {
    return this.paymentService.get_package(id_package);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get payment method' })
  @Get('getMethod')
  async get_method() {
    return this.paymentService.get_method();
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create VNPAY payment URL' })
  @Post('createOrderVNPAY')
  async create_payment_url(
    @CurrentUser() user,
    @Body() order: OrderDTO,
    @Ip() ip,
  ) {
    const id_user = user.id_user;
    return this.paymentService.generateVnpay(id_user, order, ip);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check order' })
  @Post('checkOrder')
  async check_order_return(
    @CurrentUser() user,
    @Body() orderReturn: OrderReturnDTO,
  ) {
    const id_user = user.id_user;
    return this.paymentService.check_order_return(id_user, orderReturn);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get successful orders for current user' })
  @Get('getOrder')
  async get_order(@CurrentUser() user) {
    const id_user = user.id_user;
    return this.paymentService.get_order(id_user);
  }
}
