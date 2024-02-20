import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { SmsService } from "./sms.service";

@ApiTags('SMS')
@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}
  
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send register OTP' })
  @Post('register/sendRegisterSms')
  async handleSendRegisterSms(@Body() data: any) {
    return this.smsService.sendRegisterSms();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send register OTP' })
  @Post('register/sendForgotSms')
  async handleSendForgotPasswordSms(@Body() data: any) {
    return this.smsService.sendForgotPasswordSms();
  }
}