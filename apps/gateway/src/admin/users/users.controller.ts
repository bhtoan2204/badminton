import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Admin, AdminGuard, JwtAuthGuard } from '../../utils';
import { UsersService } from './users.service';
import { BanUserDto } from './dto/banUser.dto';

@ApiTags('Admin Users')
@Controller('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Admin(true)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiQuery({ name: 'itemsPerPage', required: true, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortDesc', required: false, type: Boolean })
  @Get('getUsers')
  async getUsers(
    @Query()
    query: {
      page: number;
      itemsPerPage: number;
      search: string;
      sortBy: string;
      sortDesc: boolean;
    },
  ) {
    return this.usersService.getUsers(
      query.page,
      query.itemsPerPage,
      query.search,
      query.sortBy,
      query.sortDesc,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Put('banUser')
  async banUser(@Body() dto: BanUserDto) {
    return this.usersService.banUser(dto.id_user);
  }

  @HttpCode(HttpStatus.OK)
  @Put('unbanUser')
  async unbanUser(@Body() dto: BanUserDto) {
    return this.usersService.unbanUser(dto.id_user);
  }

  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'limit', required: true, type: Number })
  @Get('getTopUsersLogin')
  async getTopUsers(@Query('limit') limit: number) {
    return this.usersService.getTopUsers(limit);
  }
}
