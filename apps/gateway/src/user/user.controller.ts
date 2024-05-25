import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { ImageFileInterceptor } from "./interceptor/imageFile.interceptor";
import { CurrentUser } from "../utils";
import { ValidateEmailDto } from "./dto/validateEmail.dto";
import { UpdateProfileDto } from "./dto/updateProfile.dto";
import { ChangePasswordDto } from "./dto/changePassword.dto";
import { CreateAccountDto } from "./dto/createAccount.dto";
import { UserService } from "./user.service";

@ApiTags('User')
@Controller('user')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Demo Create account' })
  @Post('register/createAccountForTest')
  async createAccountForTest(@Body() createAccountDto: CreateAccountDto) {
    return this.userService.createAccount(createAccountDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Profile' })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser() user) {
    return { message: 'ok', data: user };
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
  @Post('forgotPassword')
  async forgotPassword(@Body() data: any) {
    return { message: 'forgot password', data: data };
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
  @ApiBody({ schema: { type: 'object', properties: { avatar: { type: 'string', format: 'binary', }, }, }, })
  @UseInterceptors(FileInterceptor('avatar', new ImageFileInterceptor().createMulterOptions()))
  @Put('changeAvatar')
  async changeAvatar(@CurrentUser() user, @UploadedFile() file: Express.Multer.File) {
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