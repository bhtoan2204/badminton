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

  @EventPattern('paymentClient/getOrder')
  async getOrder(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.paymentService.getOrder(
      data.id_user,
      data.page,
      data.itemsPerPage,
    );
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

  @EventPattern('paymentClient/getListOrders')
  async getListOrders(
    @Ctx() context: RmqContext,
    @Payload()
    payload: {
      page: number;
      itemsPerPage: number;
      search: string;
      sortBy: string;
      sortDirection: 'ASC' | 'DESC' | null;
      type: 'ALL' | 'MAIN' | 'EXTRA' | 'COMBO';
    },
  ) {
    this.rmqService.ack(context);
    return this.paymentService.getListOrders(
      payload.page,
      payload.itemsPerPage,
      payload.search,
      payload.sortBy,
      payload.sortDirection,
      payload.type,
    );
  }

  @EventPattern('paymentClient/getOrderStatistics')
  async getOrderStatistics(
    @Ctx() context: RmqContext,
    @Payload() data: { startDate: string; endDate: string; interval: number },
  ) {
    this.rmqService.ack(context);
    console.log(data);
    return this.paymentService.getOrderStatistics(data);
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
      data.rate,
    );
  }

  @EventPattern('paymentClient/getCountAndAverageRatingFeedback')
  async getCountAndAverageRatingFeedback(@Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.paymentService.getCountAndAverageRatingFeedback();
  }

  @EventPattern('paymentClient/paymentHistory')
  async paymentHistory(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.paymentService.paymentHistory(
      data.id_user,
      data.page,
      data.itemsPerPage,
    );
  }
}
