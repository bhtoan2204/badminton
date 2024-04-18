import { Controller, Get, HttpCode, HttpStatus, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { CurrentUser } from "../utils";
import { ChatService } from "./chat.service";

@ApiTags('Chat')
@Controller('chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService
  ) { }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all chats' })
  @Get('getUsersChat/:index')
  @ApiParam({ name: 'index', required: true, description: 'Index', type: Number })
  async getChats(@CurrentUser() user, @Param('index') index: number) {
    return this.chatService.getUsersChat(user.id_user, index);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get messages' })
  @Get('getMessages/:id_user/:index')
  @ApiParam({ name: 'id_user', required: true, description: 'The ID of the other user' })
  @ApiParam({ name: 'index', required: true, description: 'Index', type: Number })
  async getMessages(@CurrentUser() user, @Param('id_user') id_user: string, @Param('index') index: number) {
    return this.chatService.getMessages(user.id_user, id_user, index);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get messages of family' })
  @Get('getFamilyMessages/:id_family/:index')
  @ApiParam({ name: 'id_family', required: true, description: 'The ID of the family' })
  @ApiParam({ name: 'index', required: true, description: 'Pagination index', type: Number })
  async getFamilyMessages(@CurrentUser() user, @Param('id_family') id_family: number, @Param('index') index: number) {
    return this.chatService.getFamilyMessages(user.id_user, id_family, index);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark message is seen' })
  @Get('markSeenMessage/:receiver_id')
  @ApiParam({ name: 'receiver_id', required: true, description: 'The ID of the receiver' })
  async markSeen(@CurrentUser() user, @Param('receiver_id') receiver_id: string) {
    return this.chatService.markSeen(user.id_user, receiver_id);
  }
}