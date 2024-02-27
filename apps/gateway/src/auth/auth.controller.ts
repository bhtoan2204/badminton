import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthApiService, UserService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { CreateAccountDto } from "./dto/createAccount.dto";
import { LocalAuthGuard } from "./guard/local-auth.guard";
import { JwtAuthGuard } from "./guard/jwt-auth.guard";
import { CurrentUser } from "apps/gateway/decorator/current-user.decorator";
import { JwtRefreshGuard } from "./guard/refresh-auth.guard";
import { GoogleAuthGuard } from "./guard/oauth.guard/google.guard";
import { ChangePasswordDto } from "./dto/changePassword.dto";

@ApiTags('Authentication')
@Controller('auth')
@ApiBearerAuth()
export class AuthApiController {
    constructor(private readonly authService: AuthApiService) { }

    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Local Login' })
    @UseGuards(LocalAuthGuard)
    @Post('local/login')
    async localLogin(@Req() request: any, @Body() loginDto: LoginDto){

        return this.authService.localLogin(request.user);
    }

    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Google Login' })
    @UseGuards(GoogleAuthGuard)
    @Get('google/login')
    async googleLogin() {
        return { message: "google login successfully" }
    }

    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Google Callback' })
    @UseGuards(GoogleAuthGuard)
    @Get('google/callback')
    async googleLoginCallback(@Req() request: any) {
        return this.authService.googleLogin(request.user);
    }

    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh Token' })
    @UseGuards(JwtRefreshGuard)
    @Post('refresh')
    async refresh(@Req() request: any){
        return this.authService.refreshToken(request.user);
    }
}

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
    @Post('updateProfile')
    async updateProfile(@Body() data: any) {
        return { message: 'update profile', data: data };
    }
}