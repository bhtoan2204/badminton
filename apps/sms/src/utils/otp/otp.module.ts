import { Module } from "@nestjs/common";
import { Otp } from "../models/otp.model";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TwilioModule } from "nestjs-twilio";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { OTPController } from "./otp.controller";
import { OTPService } from "./otp.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Otp]),
    TwilioModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
          accountSid: config.get('TWILIO_ACCOUNT_SID'),
          authToken: config.get('TWILIO_AUTH_TOKEN'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [OTPController],
  providers: [OTPService],
})
export class OTPModule {}