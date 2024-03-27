import { Controller, Get, HttpCode, HttpStatus, Param, Res, UseGuards } from "@nestjs/common";
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
  ) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get messages' })
  @Get('getMessages/:id_user/:index')
  @ApiParam({ name: 'id_user', required: true, description: 'The ID of the other user' })
  @ApiParam({ name: 'index', required: true, description: 'Pagination index', type: Number })
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
  @ApiOperation({ summary: 'Get image' })
  @Get('getImage/:image_name')
  @ApiParam({ name: 'image_name', required: true, description: 'The name of the image' })
  async getImage(@CurrentUser() user, @Param('image_name') image_name: string, @Res() response){
    return await this.chatService.getImage(image_name);
  }
}