import { HttpException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { PAYMENT_SERVICE } from "apps/gateway/constant/services.constant";
import { OrderDTO } from "./dto/paymentDTO.dto";
import * as moment from 'moment';
import vnpayConfig from "apps/config/VNPAY.config";
import { lastValueFrom, timeout } from "rxjs";
import { PaymentController } from "./payment.controller";

@Injectable()
export class PaymentService {
  constructor(
    @Inject(PAYMENT_SERVICE) private paymentClient: ClientProxy
  ) { }

  async CreateOrder (CurrentUser, order: OrderDTO){
  try{
    const response = this.paymentClient.send('payment/create_order', {CurrentUser,order} )
        .pipe(
            timeout(5000),
        );
    const data = await lastValueFrom(response);
    return data;
        }
    catch(error){
      throw error;
    }
  }



  async generateVnpay(CurrentUser, order: OrderDTO, req, res) {
    try{
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');

    const ipAddr = 'localhost';
 
    // let ipAddr = req.headers['x-forwarded-for'] ||
    //     req.connection.remoteAddress ||
    //     req.socket.remoteAddress ||
    //     req.connection.socket.remoteAddress;
   
    let orderId = await this.CreateOrder(CurrentUser, order);

    let tmnCode = vnpayConfig.vnp_TmnCode;
    let secretKey = vnpayConfig.vnp_HashSecret;
    let vnpUrl = vnpayConfig.vnp_Url;
    let returnUrl = vnpayConfig.vnp_ReturnUrl;
    let amount = order.amount * 100;
    let bankCode = order.bankCode;
    
    let locale = order.language || 'vn'; // Sử dụng ngôn ngữ mặc định là 'vn' nếu không có trong yêu cầu
    let currCode = 'VND';

    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId // mã đơn hàng
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma giao dich:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl + orderId;;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if(bankCode !== null && bankCode !== ''){
        vnp_Params['vnp_BankCode'] = bankCode;
    }



    vnp_Params = sortObject(vnp_Params);

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");     
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
    console.log(vnpUrl);

    //res.redirect(vnpUrl)
    return vnpUrl;
  }
    catch (error) {
      throw error;
    }
  }

  async UpdateStatus(order_id: any){
    try {
      const response = this.paymentClient.send('payment/update_status', {order_id} )
          .pipe(
              timeout(5000),
          );
      const data = await lastValueFrom(response);
      return data;
  } catch (err) {
      throw err;
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

