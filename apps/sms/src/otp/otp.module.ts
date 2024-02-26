import { Module } from "@nestjs/common";
import { TwilioModule } from "nestjs-twilio";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { OTPController } from "./otp.controller";
import { OTPService } from "./otp.service";
import { RmqModule } from "@app/common";

@Module({
  imports: [
    TwilioModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
          accountSid: config.get('TWILIO_ACCOUNT_SID'),
          authToken: config.get('TWILIO_AUTH_TOKEN'),
      }),
      inject: [ConfigService],
    }),
    RmqModule,
  ],
  controllers: [OTPController],
  providers: [OTPService],
})
export class OTPModule {}