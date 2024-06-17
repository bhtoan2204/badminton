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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
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
import { CreateRoomDto } from './dto/createRoom.dto';
import { UpdateRoomDto } from './dto/updateRoom.dto';

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
  @Post('createRoom')
  async createRoom(@CurrentUser() currentUser, @Body() body: CreateRoomDto) {
    return this.roomService.createRoom(currentUser.id_user, body);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update room' })
  @Put('updateRoom')
  async updateRoom(@CurrentUser() currentUser, @Body() body: UpdateRoomDto) {
    return this.roomService.updateRoom(currentUser.id_user, body);
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
