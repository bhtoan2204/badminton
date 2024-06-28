import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { RoomService } from './room.service';
import {
  CurrentUser,
  JwtAuthGuard,
  MemberFamilyGuard,
  Permission,
  PERMISSION_HOUSEHOLD,
} from '../../utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileInterceptor } from '../../utils/interceptor/imageFile.interceptor';

@ApiTags('Room')
@Controller('room')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, MemberFamilyGuard)
@Permission([PERMISSION_HOUSEHOLD])
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all rooms' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'itemsPerPage', type: Number, required: false })
  @Get('getRooms/:id_family')
  async getRooms(
    @CurrentUser() currentUser,
    @Param('id_family') id_family: number,
    @Query('page') page: number,
    @Query('itemsPerPage') itemsPerPage: number,
  ) {
    if (!page) page = 1;
    if (!itemsPerPage) itemsPerPage = 10;
    return this.roomService.getRooms(
      currentUser.id_user,
      id_family,
      page,
      itemsPerPage,
    );
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create room' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id_family: {
          type: 'number',
        },
        room_name: {
          type: 'string',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['id_family', 'room_name'],
    },
  })
  @UseInterceptors(
    FileInterceptor('image', new ImageFileInterceptor().createMulterOptions()),
  )
  @Post('createRoom')
  async createRoom(
    @CurrentUser() currentUser,
    @Body() body: { id_family: number; room_name: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.roomService.createRoom(currentUser.id_user, body, file);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update room' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id_room: {
          type: 'number',
        },
        id_family: {
          type: 'number',
        },
        room_name: {
          type: 'string',
        },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['id_family', 'id_room'],
    },
  })
  @UseInterceptors(
    FileInterceptor('image', new ImageFileInterceptor().createMulterOptions()),
  )
  @Put('updateRoom')
  async updateRoom(
    @CurrentUser() currentUser,
    @Body() body: { id_room: number; room_name: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.roomService.updateRoom(currentUser.id_user, body, file);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete room' })
  @Delete('deleteRoom/:id_family/:id_room')
  async deleteRoom(
    @CurrentUser() currentUser,
    @Param('id_family') id_family: number,
    @Param('id_room') id_room: number,
  ) {
    return this.roomService.deleteRoom(currentUser.id_user, id_family, id_room);
  }
}
