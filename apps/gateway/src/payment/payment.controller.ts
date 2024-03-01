import { Body, Controller, HttpCode, HttpStatus, Post, Query,Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { OrderDTO } from './dto/paymentDTO.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CurrentUser } from 'apps/gateway/decorator/current-user.decorator';
import { Response, Request } from 'express';
import vnpayConfig from "apps/config/VNPAY.config";
let express = require('express');
let router = express.Router();


@ApiTags('payment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payment')
export class PaymentController {
    static vnpayReturn(arg0: string, vnpayReturn: any) {
        throw new Error('Method not implemented.');
    }
  constructor(private readonly paymentService: PaymentService) {}


  async createorder(@CurrentUser() user,@Body() payment: OrderDTO) {

      return this.paymentService.CreateOrder(user,payment);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create payment URL' })
  @UseGuards(JwtAuthGuard)
  @Post('create_payment_url')
  async create_payment_url(@CurrentUser() user,@Body() payment: OrderDTO,  req: Request,res: Response) {

      return this.paymentService.generateVnpay(user,payment,req,res);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Return payment URL' })
  @Get('vnpay_ipn')
  async vnpay_ipn(req: Request,res: Response){
    //return this.paymentService.vnpayReturn ( query, req, res);

    try {
      const { order_id , vnp_ResponseCode } = req.query;
      if(vnp_ResponseCode == '00'){
          await this.paymentService.UpdateStatus(order_id);
          const redirectUrl = 'http://localhost:8080/checkout?orderId=' + order_id + 'status=succes';
          res.status(200).json({RspCode: '00', Message: 'success'})
          return res.writeHead(301, { Location: redirectUrl }).end();
      } else {
          const redirectUrl = 'http://localhost:8080/checkout?orderId=' + order_id + 'status=failed';
          res.status(200).json({RspCode: '97', Message: 'Fail checksum'})

          return res.writeHead(301, { Location: redirectUrl }).end();
      }
  } catch (error) {
      throw(error);
  }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Return payment URL' })
  @Get('vnpay_return')
  async vnpay_return(@Query() query: any, req: Request,res: Response){
    let vnp_Params = query;

    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    let tmnCode = vnpayConfig.vnp_TmnCode;
    let secretKey = vnpayConfig.vnp_HashSecret;

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");     
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex"); 

    if(secureHash === signed){
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

    } else{
    }

}
async vnpayReturn(req, res, next){
  try {
      const { order_id , vnp_ResponseCode } = req.query;
      if(vnp_ResponseCode == '00'){
          await this.paymentService.UpdateStatus(order_id);
          const redirectUrl = 'http://localhost:3002/order-complete?orderId=' + order_id + 'status=success';
          return res.writeHead(301, { Location: redirectUrl }).end();
      } else {
          const redirectUrl = 'http://localhost:3002/checkout?orderId=' + order_id + 'status=failed';
          return res.writeHead(301, { Location: redirectUrl }).end();
      }
  } catch (error) {
      
  }
}
}


function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj){
    if (obj.hasOwnProperty(key)) {
    str.push(encodeURIComponent(key));
    }
  }
  str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

router.get('/vnpay_return', function (req, res, next) {
  let vnp_Params = req.query;

  let secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);

  let config = require('config');
  let tmnCode = config.get('vnp_TmnCode');
  let secretKey = config.get('vnp_HashSecret');

  let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");     
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     

  if(secureHash === signed){
      //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

      res.render('success', {code: vnp_Params['vnp_ResponseCode']})
  } else{
      res.render('success', {code: '97'})
  }
});