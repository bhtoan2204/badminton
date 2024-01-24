import { RmqService } from "@app/common";
import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";

@Controller()
export class SmsController {
  constructor(
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('authClient/send_register_sms')
  async handleSendRegisterSms(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return {message: 'Send register sms successfully'}
  }
}