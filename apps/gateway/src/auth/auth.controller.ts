import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthApiService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import { FacebookAuthGuard, GoogleAuthGuard, JwtRefreshGuard, LocalAuthGuard } from "../utils";

@ApiTags('Authentication')
@Controller('auth')
@ApiBearerAuth()
export class AuthApiController {
  constructor(
    private readonly authService: AuthApiService,
    private readonly configService: ConfigService
  ) { }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Local Login' })
  @UseGuards(LocalAuthGuard)
  @Post('local/login')
  async localLogin(@Req() request: any, @Body() loginDto: LoginDto) {
    return this.authService.localLogin(request.user);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Google Login' })
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  async googleLogin() {
    return { message: "google login" }
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Google Callback' })
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleLoginCallback(@Req() request: any, @Res({ passthrough: true }) response: Response) {
    const { accessToken, refreshToken } = await this.authService.localLogin(request.user);

    response.setHeader('accessToken', accessToken);
    response.setHeader('refreshToken', refreshToken);

    return response.redirect(`${this.configService.get('FRONTEND_URL')}/setup&login=google`);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Link to Facebook' })
  @UseGuards(FacebookAuthGuard)
  @Get('facebook/login')
  async facebookLogin() {
    return { message: 'facebook login' };
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Link to Facebook' })
  @UseGuards(FacebookAuthGuard)
  @Get('facebook/callback')
  async facebookLoginCallback(@Req() request: any, @Res({ passthrough: true }) response: Response) {
    const { accessToken, refreshToken } = await this.authService.localLogin(request.user);

    response.setHeader('accessToken', accessToken);
    response.setHeader('refreshToken', refreshToken);

    return response.redirect(`${this.configService.get('FRONTEND_URL')}/setup&login=facebook`);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh Token' })
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@Req() request: any) {
    const refreshToken = request.headers['authorization'].split(' ')[1];
    return this.authService.refreshToken(request.user, refreshToken);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout' })
  @UseGuards(JwtRefreshGuard)
  @Post('logout')
  async logout(@Req() request: any) {
    const refreshToken = request.headers['authorization'].split(' ')[1];
    return this.authService.logout(refreshToken);
  }
}