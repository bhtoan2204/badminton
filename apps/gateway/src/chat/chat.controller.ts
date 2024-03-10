import { Controller, Get, HttpCode, HttpStatus, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { CurrentUser } from "../utils/decorator/current-user.decorator";
import { ChatService } from "./chat.service";

@ApiTags('Chat')
@Controller('chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService
  ) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get messages' })
  @Get('getMessages/:id_user/:index')
  @ApiParam({ name: 'id_user', required: true, description: 'The ID of the other user' })
  @ApiParam({ name: 'index', required: true, description: 'Pagination index', type: Number })
  async getMessages(@CurrentUser() user, @Param('id_user') id_user: string, @Param('index') index: number) {
    return this.chatService.getMessages(user.id_user, id_user, index);
  }
}