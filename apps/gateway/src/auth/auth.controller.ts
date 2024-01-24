import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthApiService, UserService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { CreateAccountDto } from "./dto/createAccount.dto";
import { LocalAuthGuard } from "./guard/local-auth.guard";

@ApiTags('Authentication')
@Controller('auth')
export class AuthApiController {
    constructor(private readonly authService: AuthApiService) { }

    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Local Login' })
    @UseGuards(LocalAuthGuard)
    @Post('local/login')
    async localLogin(@Body() loginDto: LoginDto) {
        return this.authService.localLogin(loginDto);
    }
}

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly authService: UserService) { }

    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Send Register Sms' })
    @Post('register/sendRegisterSms')
    async sendRegisterSms() {
        return this.authService.sendRegisterSms();
    }

    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Demo Create account' })
    @Post('register/createAccountForTest')
    async createAccountForTest(@Body() createAccountDto: CreateAccountDto) {
        return this.authService.createAccount(createAccountDto);
    }

}