import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthApiService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { LocalAuthGuard } from "./guard/local-auth.guard";
import { JwtRefreshGuard } from "./guard/refresh-auth.guard";
import { GoogleAuthGuard } from "./guard/oauth.guard/google.guard";

@ApiTags('Authentication')
@Controller('auth')
@ApiBearerAuth()
export class AuthApiController {
    constructor(private readonly authService: AuthApiService) { }

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
    async refresh(@Req() request: any) {
        return this.authService.refreshToken(request.user);
    }
}