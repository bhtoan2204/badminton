import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileInterceptor } from './interceptor/imageFile.interceptor';
import { CurrentUser, JwtAuthGuard } from '../utils';
import { ValidateEmailDto } from './dto/validateEmail.dto';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { CreateAccountDto } from './dto/createAccount.dto';
import { UserService } from './user.service';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { CheckOTPDto } from './dto/checkOtp.dto';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('User')
@Controller('user')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create account' })
  @Post('register/createAccount')
  async createAccountForTest(@Body() createAccountDto: CreateAccountDto) {
    return this.userService.createAccount(createAccountDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify account' })
  @Post('register/verifyAccount')
  async verifyAccount(@Body() data: any) {
    // return this.userService.verifyAccount(data);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Profile' })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser() user) {
    return this.userService.getProfile(user);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change Password' })
  @UseGuards(JwtAuthGuard)
  @Post('changePassword')
  async changePassword(@CurrentUser() user, @Body() data: ChangePasswordDto) {
    return this.userService.changePassword(user, data);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Forgot Password' })
  @UseGuards(ThrottlerGuard)
  @Post('forgotPassword')
  async forgotPassword(@Body() data: ForgotPasswordDto) {
    return this.userService.forgotPassword(data);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check OTP forgot password' })
  @Post('checkOTPForgotPassword')
  async checkOTP(@Body() data: CheckOTPDto) {
    return this.userService.checkOTP(data);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset Password' })
  @Post('resetPassword')
  async resetPassword(@Body() data: ResetPasswordDto) {
    return this.userService.resetPassword(data);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update Profile' })
  @UseGuards(JwtAuthGuard)
  @Put('updateProfile')
  async updateProfile(@CurrentUser() user, @Body() data: UpdateProfileDto) {
    return this.userService.updateProfile(user, data);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change Avatar' })
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { avatar: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(
    FileInterceptor('avatar', new ImageFileInterceptor().createMulterOptions()),
  )
  @Put('changeAvatar')
  async changeAvatar(
    @CurrentUser() user,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.changeAvatar(user, file);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate Email' })
  @UseGuards(JwtAuthGuard)
  @Post('validateEmail')
  async validateEmail(@CurrentUser() user, @Body() data: ValidateEmailDto) {
    return this.userService.validateEmail(user, data);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get All User' })
  @UseGuards(JwtAuthGuard)
  @Get('getAllUser')
  async getAllUser() {
    return this.userService.getAllUser();
  }
}
