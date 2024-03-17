import { Controller } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Controller()
export class PaymentController {
  constructor(
  private readonly paymentService: PaymentService,
  private readonly rmqService: RmqService) {}

  @EventPattern('payment/get_package')
  async get_package(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.paymentService.get_package(data.id_package);
  }

  @EventPattern('payment/get_all_package')
  async get_all_package(@Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.paymentService.get_all_package();
  }

  @EventPattern('payment/get_method')
  async get_method(@Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.paymentService.get_method();
  }
  @EventPattern('payment/get_order')
  async get_order(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.paymentService.get_order(data.id_user);
  }



  @EventPattern('payment/check_order_return')
  async UpdateStatus(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.paymentService.check_order(data.id_user, data.orderReturn);
  }

  @EventPattern('payment/generateVnpay')
  async generateVnpay(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.paymentService.generateVnpay(data.id_user, data.order, data.ip);
  }


  
}