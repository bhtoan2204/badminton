import { RmqService } from "@app/common";
import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";
import { SmsService } from "./sms.service";

@Controller()
export class SmsController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly smsService: SmsService
  ) {}

  @EventPattern('smsClient/send_register_sms')
  async handleSendRegisterSms(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.smsService.sendRegisterSMS();
  }

  @EventPattern('smsClient/send_forgot_sms')
  async handleSendForgotSms(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.smsService.sendForgotSMS();
  }
}