import { Body, Controller, HttpCode, HttpStatus, Post, Query,Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { OrderDTO } from './dto/order.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CurrentUser } from '../utils/decorator/current-user.decorator';
import { Response, Request } from 'express';
import { OrderReturnDTO } from './dto/OrderReturn.dto';


@ApiTags('Payment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}


  async create_order(@CurrentUser() user,@Body() payment: OrderDTO) {
      return this.paymentService.create_order(user,payment);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get package' })
  @UseGuards(JwtAuthGuard)
  @Get('GetPackage')
  async get_package() {
    return this.paymentService.get_package();
  }


  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create payment URL' })
  @UseGuards(JwtAuthGuard)
  @Post('CreateOrder')
  async create_payment_url(@CurrentUser() user,@Body() order: OrderDTO,  req: Request,res: Response) {
    const id_user = user.id_user;
    return this.paymentService.generateVnpay(id_user,order,req,res);
  }


  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check order' })
  @UseGuards(JwtAuthGuard)
  @Post('CheckOrder')
  async check_order_return(@CurrentUser() user,@Body() OrderReturn: OrderReturnDTO) {
    const id_user = user.id_user;
    return this.paymentService.check_order_return(id_user,OrderReturn);
  }
}