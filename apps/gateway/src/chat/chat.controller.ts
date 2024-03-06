import { Controller, Get, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { CurrentUser } from "../utils/decorator/current-user.decorator";

@ApiTags('Chat')
@Controller('chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(
  ) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all messages' })
  @Get('getMessages/:index')
  async getMessages(@CurrentUser() user) {
    return "message";
  }
}