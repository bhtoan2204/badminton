import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard, MemberFamilyGuard } from '../utils';
import { ChatService } from './chat.service';
import { NewMessageDto } from './dto/newMessage.dto';
import { ChatGateway } from './chat.gateway';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileInterceptor } from '../utils/interceptor/imageFile.interceptor';
import { VideoFileInterceptor } from '../utils/interceptor/videoFile.interceptor';
import { NewFamilyMessageDto } from './dto/newFamilyMessage.dto';

@ApiTags('Chat')
@Controller('chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, MemberFamilyGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send text message' })
  @Post('sendMessage')
  async sendMessage(@CurrentUser() user, @Body() dto: NewMessageDto) {
    const data = await this.chatService.saveMessage(user.id_user, dto);
    this.chatGateway.emitMessageToUser(dto.receiverId, data);
    return data;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send text message' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'The image of the expense (optional)',
        },
        receiverId: {
          type: 'string',
          description: 'The ID of the receiver',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('image', new ImageFileInterceptor().createMulterOptions()),
  )
  @Post('sendImageMessage')
  async sendImageMessage(
    @CurrentUser() user,
    @Body() dto: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data = await this.chatService.saveImageMessage(
      user.id_user,
      dto.receiverId,
      file,
    );
    this.chatGateway.emitMessageToUser(dto.receiverId, data);
    return data;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send video message' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        video: {
          type: 'string',
          format: 'binary',
          description: 'The video of the expense (optional)',
        },
        receiverId: {
          type: 'string',
          description: 'The ID of the receiver',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('video', new VideoFileInterceptor().createMulterOptions()),
  )
  @Post('sendVideoMessage')
  async sendVideoMessage(
    @CurrentUser() user,
    @Body() dto: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data = await this.chatService.saveVideoMessage(
      user.id_user,
      dto.receiverId,
      file,
    );
    this.chatGateway.emitMessageToUser(dto.receiverId, data);
    return data;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send family text message' })
  @Post('sendFamilyMessage')
  async sendFamilyMessage(
    @CurrentUser() user,
    @Body() dto: NewFamilyMessageDto,
  ) {
    const data = await this.chatService.saveFamilyMessage(user.id_user, dto);
    this.chatGateway.emitFamilyMessageToUser(user.id_user, dto.familyId, data);
    return data;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send family image message' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'The image of the expense (optional)',
        },
        familyId: {
          type: 'string',
          description: 'The ID of the receiver',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('image', new ImageFileInterceptor().createMulterOptions()),
  )
  @Post('sendFamilyImage')
  async sendFamilyImage(
    @CurrentUser() user,
    @Body() dto: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data = await this.chatService.saveFamilyImageMessage(
      user.id_user,
      dto.familyId,
      file,
    );
    this.chatGateway.emitFamilyMessageToUser(user.id_user, dto.familyId, data);
    return data;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send family video message' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        video: {
          type: 'string',
          format: 'binary',
          description: 'The video of the expense (optional)',
        },
        familyId: {
          type: 'string',
          description: 'The ID of the receiver',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('video', new VideoFileInterceptor().createMulterOptions()),
  )
  @Post('sendFamilyVideo')
  async sendFamilyVideo(
    @CurrentUser() user,
    @Body() dto: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data = await this.chatService.saveFamilyVideoMessage(
      user.id_user,
      dto.familyId,
      file,
    );
    this.chatGateway.emitFamilyMessageToUser(user.id_user, dto.familyId, data);
    return data;
  }

  // --------------------------------------------------------------
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all chats' })
  @Get('getUsersChat/:index')
  @ApiParam({
    name: 'index',
    required: true,
    description: 'Index',
    type: Number,
  })
  async getChats(@CurrentUser() user, @Param('index') index: number) {
    return this.chatService.getUsersChat(user.id_user, index);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get messages' })
  @Get('getMessages/:id_user/:index')
  @ApiParam({
    name: 'id_user',
    required: true,
    description: 'The ID of the other user',
  })
  @ApiParam({
    name: 'index',
    required: true,
    description: 'Index',
    type: Number,
  })
  async getMessages(
    @CurrentUser() user,
    @Param('id_user') id_user: string,
    @Param('index') index: number,
  ) {
    return this.chatService.getMessages(user.id_user, id_user, index);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get family chats list' })
  @Get('getFamilyChats')
  async getFamilyChats(@CurrentUser() user) {
    return this.chatService.getFamilyChats(user.id_user);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get messages of family' })
  @Get('getFamilyMessages/:id_family/:index')
  @ApiParam({
    name: 'id_family',
    required: true,
    description: 'The ID of the family',
  })
  @ApiParam({
    name: 'index',
    required: true,
    description: 'Pagination index',
    type: Number,
  })
  async getFamilyMessages(
    @CurrentUser() user,
    @Param('id_family') id_family: number,
    @Param('index') index: number,
  ) {
    return this.chatService.getFamilyMessages(user.id_user, id_family, index);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark message is seen' })
  @Get('markSeenMessage/:receiver_id')
  @ApiParam({
    name: 'receiver_id',
    required: true,
    description: 'The ID of the receiver',
  })
  async markSeen(
    @CurrentUser() user,
    @Param('receiver_id') receiver_id: string,
  ) {
    return this.chatService.markSeen(user.id_user, receiver_id);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove message' })
  @Get('removeMessage/:receiver_id/:id_message')
  @ApiParam({
    name: 'receiver_id',
    required: true,
    description: 'The ID of the receiver',
  })
  @ApiParam({
    name: 'id_message',
    required: true,
    description: 'The ID of the message',
  })
  async removeMessage(
    @CurrentUser() user,
    @Param('receiver_id') receiver_id: string,
    @Param('id_message') id_message: string,
  ) {
    return this.chatService.removeMessage(
      user.id_user,
      receiver_id,
      id_message,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Linked User' })
  @ApiQuery({ name: 'search', required: false, description: 'Search string' })
  @UseGuards(JwtAuthGuard)
  @Get('getLinkedUser')
  async getLinkedUser(@CurrentUser() user, @Param('search') search: string) {
    return this.chatService.getLinkedUser(user.id_user, search);
  }
}
