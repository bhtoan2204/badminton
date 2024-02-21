import { RmqService } from "@app/common";
import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";
import { OTPService } from "./otp.service";

@Controller()
export class OTPController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly OTPService: OTPService
  ) {}

  @EventPattern('smsClient/send_register_OTP')
  async handleSendRegisterOTP(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.OTPService.sendRegisterOTP();
  }

  @EventPattern('smsClient/send_forgot_OTP')
  async handleSendForgotOTP(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.OTPService.sendForgotOTP();
  }
}