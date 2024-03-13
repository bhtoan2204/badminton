import { Controller } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Controller()
export class PaymentController {
  constructor(
  private readonly paymentService: PaymentService,
  private readonly rmqService: RmqService) {}


  @EventPattern('payment/create_order')
  async CreateOrder(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.paymentService.CreateOrder(data.id_user, data.id_package );
  }

  @EventPattern('payment/update_status')
  async UpdateStatus(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.paymentService.UpdateStatus(data.orderId);
  }
}