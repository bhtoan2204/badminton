import { RmqModule } from "@app/common";
import { Module } from "@nestjs/common";
import { SMS_SERVICE } from "apps/gateway/src/utils/constant/services.constant";
import { SmsController } from "./sms.controller";
import { SmsService } from "./sms.service";

@Module({
  imports: [
    RmqModule.register({ name: SMS_SERVICE }),
  ],
  controllers: [SmsController],
  providers: [SmsService],
})
export class SmsModule { }