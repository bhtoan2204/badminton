import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthApiService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";

@ApiTags('Authentication')
@Controller('auth')
export class AuthApiController {
    constructor(private readonly authService: AuthApiService) { }

    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Local Login' })
    @Post('local/login')
    async localLogin(@Body() loginDto: LoginDto) {
        return this.authService.localLogin(loginDto);
    }
}