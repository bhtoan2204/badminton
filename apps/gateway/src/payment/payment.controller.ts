import { Body, Controller, HttpCode, HttpStatus, Post, Query,Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { OrderDTO } from './dto/order.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CurrentUser } from '../utils/decorator/current-user.decorator';
import { Response, Request } from 'express';


@ApiTags('Payment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}


  async createorder(@CurrentUser() user,@Body() payment: OrderDTO) {
      return this.paymentService.CreateOrder(user,payment);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create payment URL' })
  @UseGuards(JwtAuthGuard)
  @Post('CreateOrder')
  async create_payment_url(@CurrentUser() user,@Body() order: OrderDTO,  req: Request,res: Response) {
    const id_user = user.id_user;
    return this.paymentService.generateVnpay(id_user,order,req,res);
  }
}