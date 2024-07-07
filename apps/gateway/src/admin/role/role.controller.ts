import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Admin, AdminGuard, JwtAuthGuard } from '../../utils';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/createRole.dto';
import { UpdateRoleDto } from './dto/updateRole.dto';

@ApiTags('Admin Family Role')
@Controller('role')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Admin(true)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiQuery({ name: 'itemsPerPage', required: true, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortDesc', required: false, type: Boolean })
  @Get()
  async getAllRole(
    @Query()
    query: {
      page: number;
      itemsPerPage: number;
      search: string;
      sortBy: string;
      sortDesc: boolean;
    },
  ) {
    return this.roleService.getAllRole(
      query.page,
      query.itemsPerPage,
      query.search,
      query.sortBy,
      query.sortDesc,
    );
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createRole(@Body() dto: CreateRoleDto) {
    return this.roleService.createRole(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Put()
  async updateRole(@Body() dto: UpdateRoleDto) {
    return this.roleService.updateRole(dto);
  }
}
