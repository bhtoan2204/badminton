import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { PAYMENT_SERVICE } from "../utils/constant/services.constant";
import { OrderDTO } from "./dto/order.dto";
import * as moment from 'moment';
import { lastValueFrom, timeout } from "rxjs";
import vnpayConfig from "apps/config/vnpay.config";

@Injectable()
export class PaymentService {
  constructor(
    @Inject(PAYMENT_SERVICE) private paymentClient: ClientProxy
  ) { }

  async get_package()
  {
    const response = this.paymentClient.send('payment/get_package', {} )
        .pipe(
            timeout(5000),
        );
    const data = await lastValueFrom(response);
    return data;
        }
        catch (error) {
          throw new RpcException({
            message: error.message,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR
          });
        }
  
  async create_order (id_user, id_package){
  try{
    const response = this.paymentClient.send('payment/create_order', {id_user,id_package} )
        .pipe(
            timeout(5000),
        );
    const data = await lastValueFrom(response);
    return data;
        }
        catch (error) {
          throw new RpcException({
            message: error.message,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR
          });
        }
      }

  async check_order_return(id_user, OrderReturn){
    try{
      const response = this.paymentClient.send('payment/check_order_return', {id_user,OrderReturn} )
          .pipe(
              timeout(5000),
          );
      const data = await lastValueFrom(response);
      return data;
          }
          catch (error) {
            throw new RpcException({
              message: error.message,
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR
            });
          }
        }

  async generateVnpay(id_user, order: OrderDTO, req, res) {
    try{
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');

    const ipAddr = 'localhost';
 
    // let ipAddr = req.headers['x-forwarded-for'] ||
    //     req.connection.remoteAddress ||
    //     req.socket.remoteAddress ||
    //     req.connection.socket.remoteAddress;
    let id_package = order.id_package;
    let orderId = await this.create_order(id_user, id_package);

    let tmnCode = vnpayConfig.vnp_TmnCode;
    let secretKey = vnpayConfig.vnp_HashSecret;
    let vnpUrl = vnpayConfig.vnp_Url;
    let returnUrl = vnpayConfig.vnp_ReturnUrl;
    let amount = order.amount * 100;
    let bankCode = order.bankCode;
    
    let locale = order.language || 'vn'; 
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

    //res.redirect(vnpUrl)
    return vnpUrl;
  }
    catch (error) {
        throw new RpcException({
          message: error.message,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR
        });
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