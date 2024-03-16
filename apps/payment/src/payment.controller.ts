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
  async get_package(@Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.paymentService.get_package();
  }
  @EventPattern('payment/get_order')
  async get_order(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.paymentService.get_order(data.id_user);
  }

  @EventPattern('payment/create_order')
  async CreateOrder(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.paymentService.create_order(data.id_user, data.id_package );
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