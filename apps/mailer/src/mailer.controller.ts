import { Controller } from '@nestjs/common';
import { MailService } from './mailer.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Controller()
export class MailController {
  constructor(
    private readonly mailerService: MailService,
    private readonly rmqService: RmqService,
    ) {}

  @EventPattern('mailClient/sendUserConfirmation')
  async sendUserConfirmation(@Payload() dto: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.mailerService.sendUserConfirmation(dto);
  }

  @EventPattern('mailClient/sendInvite')
  async sendInvite(@Payload() dto: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
  }
}
