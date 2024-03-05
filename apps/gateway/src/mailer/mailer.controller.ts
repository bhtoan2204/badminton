
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { MailService } from "./mailer.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { SendEmailRegisterDto } from "./dto/sendEmailRegister.dto";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { CurrentUser } from "../utils/decorator/current-user.decorator";

@ApiTags('Mailer')
@Controller('mailer')
@ApiBearerAuth()
export class MailController {
  constructor(
    private readonly mailerService: MailService
  ) {}
  
  @ApiOperation({ summary: 'Send user confirmation' })
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @Post('sendEmailConfirmation')
  async sendUserConfirmation(@CurrentUser() userInfo, @Body() dto: SendEmailRegisterDto) {
    return await this.mailerService.sendUserConfirmation(userInfo, dto.email);
  }
}