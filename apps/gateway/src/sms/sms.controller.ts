import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { SmsService } from "./sms.service";
import { ValidatePhoneDto } from "./dto/validatePhone";

@ApiTags('SMS')
@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}
  
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send register OTP' })
  @Post('validate/sendValidateSms')
  async handleSendValidatePhoneSms(@Body() data: ValidatePhoneDto) {
    return this.smsService.sendValidatePhoneSms(data);
  }
}