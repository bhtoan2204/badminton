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

  @EventPattern('smsClient/sendValidatePhoneSms')
  async sendValidatePhoneSms(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.OTPService.sendValidatePhoneSms(data);
  }
}