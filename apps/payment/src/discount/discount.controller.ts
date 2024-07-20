import { Controller } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Controller()
export class DiscountController {
  constructor(
    private readonly discountService: DiscountService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('paymentClient/addDiscount')
  async addDiscount(@Payload() dto: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.discountService.addDiscount(dto);
  }

  @EventPattern('paymentClient/getDiscounts')
  async getDiscounts(@Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.discountService.getDiscounts();
  }

  @EventPattern('paymentClient/updateDiscount')
  async updateDiscount(@Payload() dto: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.discountService.updateDiscount(dto);
  }

  @EventPattern('paymentClient/deleteDiscount')
  async deleteDiscount(@Payload() code: string, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.discountService.deleteDiscount(code);
  }
}
