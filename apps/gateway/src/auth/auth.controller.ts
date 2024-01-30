import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthApiService, UserService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { CreateAccountDto } from "./dto/createAccount.dto";
import { LocalAuthGuard } from "./guard/local-auth.guard";
import { JwtAuthGuard } from "./guard/jwt-auth.guard";
import { CurrentUser } from "apps/gateway/decorator/current-user.decorator";

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

    // @HttpCode(HttpStatus.OK)
    // @ApiOperation({ summary: 'Refresh Token' })
    // @Post('refreshToken')
    // async refreshToken(@Body() refreshTokenDto: any){
    //     return this.authService.refreshToken(refreshTokenDto.refreshToken);
    // }
}

@ApiTags('User')
@Controller('user')
@ApiBearerAuth()
export class UserController {
    constructor(private readonly userService: UserService) { }

    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Send Register Sms' })
    @Post('register/sendRegisterSms')
    async sendRegisterSms() {
        return this.userService.sendRegisterSms();
    }

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
        return {message: 'ok', data: user};
    }
}