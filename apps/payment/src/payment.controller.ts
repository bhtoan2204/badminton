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

  @EventPattern('paymentClient/getAvailableFunction')
  async getAvailableFunction(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.paymentService.getAvailableFunction(
      data.id_user,
      data.id_family,
    );
  }

  @EventPattern('paymentClient/verifyOrder')
  async updateStatus(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.paymentService.checkOrder(data.id_user, data.dto);
  }

  @EventPattern('paymentClient/getMainPackage')
  async get_main_package(@Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.paymentService.getMainPackage();
  }

  @EventPattern('paymentClient/getExtraPackage')
  async get_extra_package(@Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.paymentService.getExtraPackage();
  }

  @EventPattern('paymentClient/getComboPackage')
  async get_combo_package(@Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.paymentService.getComboPackage();
  }

  @EventPattern('paymentClient/placeOrder')
  async placeOrder(@Payload() data: any, @Ctx() context: RmqContext) {
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
