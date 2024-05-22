import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';
import { RabbitMqService } from "../rabbitmq/rabbitmq.service";

@Controller()
export class RabbitMqController {
  constructor(
    private readonly rabbitMqService: RabbitMqService,
    private readonly rmqService: RmqService
  ) {}

  @EventPattern('rabbitMqClient/getQueues')
  async getQueues(@Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.rabbitMqService.getQueues();
  }

  @EventPattern('rabbitMqClient/getQueueDetail')
  async getQueueDetail(@Payload() data: any, @Ctx() context: RmqContext, ) {
    this.rmqService.ack(context);
    return this.rabbitMqService.getQueueDetail(data.queueName);
  }

  @EventPattern('rabbitMqClient/getNode')
  async getNode(@Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.rabbitMqService.getNode();
  }

  @EventPattern('rabbitMqClient/getNodeStatistics')
  async getNodeStatistics(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.rabbitMqService.getNodeStatistics(data.nodeName);
  }

  @EventPattern('rabbitMqClient/healthCheck')
  async healthCheck(@Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.rabbitMqService.healthCheck();
  }
}