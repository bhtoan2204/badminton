import { Controller, Get } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { RmqService } from '@app/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('notificationClient/getNotifications')
  async getNotification(@Payload() dto: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.notificationService.getNotification(dto.id_user, dto.index);
  }
}
