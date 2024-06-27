import { Controller } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Controller()
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('paymentClient/get_package')
  async get_package(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.paymentService.get_package(data.id_package);
  }

  @EventPattern('paymentClient/get_all_package')
  async get_all_package(@Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.paymentService.get_all_package();
  }

  @EventPattern('paymentClient/get_order')
  async get_order(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.paymentService.get_order(data.id_user);
  }

  @EventPattern('paymentClient/check_order_return')
  async UpdateStatus(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.paymentService.check_order(data.id_user, data.orderReturn);
  }

  @EventPattern('paymentClient/get_main_package')
  async get_main_package(@Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.paymentService.getMainPackage();
  }

  @EventPattern('paymentClient/get_extra_package')
  async get_extra_package(@Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.paymentService.getExtraPackage();
  }

  @EventPattern('paymentClient/get_combo_package')
  async get_combo_package(@Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.paymentService.getComboPackage();
  }

  @EventPattern('paymentClient/place_order')
  async place_order(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.paymentService.placeOrder(
      data.id_user,
      data.order,
      data.packageType,
      data.ip,
    );
  }

  @EventPattern('paymentClient/createFeedback')
  async createFeedback(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.paymentService.createFeedback(data.id_user, data.dto);
  }

  @EventPattern('paymentClient/getFeedback')
  async getFeedback(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.paymentService.getFeedBack(
      data.page,
      data.itemsPerPage,
      data.search,
      data.sortBy,
      data.sortDesc,
    );
  }

  @EventPattern('paymentClient/getCountAndAverageRatingFeedback')
  async getCountAndAverageRatingFeedback(@Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.paymentService.getCountAndAverageRatingFeedback();
  }
}
