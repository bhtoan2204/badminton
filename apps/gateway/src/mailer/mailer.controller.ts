import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MailService } from './mailer.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SendEmailRegisterDto } from './dto/sendEmailRegister.dto';
import { CurrentUser } from '../utils/decorator/current-user.decorator';
import { JwtAuthGuard } from '../utils';

@ApiTags('Mailer')
@Controller('mailer')
@ApiBearerAuth()
export class MailController {
  constructor(private readonly mailerService: MailService) {}

  @ApiOperation({ summary: 'Send user confirmation' })
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @Post('sendEmailConfirmation')
  async sendUserConfirmation(
    @CurrentUser() userInfo,
    @Body() dto: SendEmailRegisterDto,
  ) {
    return await this.mailerService.sendUserConfirmation(userInfo, dto.email);
  }

  @ApiOperation({ summary: 'Send invitation' })
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @Post('sendInvite')
  async sendInvitation(
    @CurrentUser() user,
    @Query('id_family') id_family: number,
  ) {
    const id_user = user.id_user;
    return await this.mailerService.sendInvitation(id_user, id_family);
  }
}
