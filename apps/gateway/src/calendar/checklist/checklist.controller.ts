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
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  CurrentUser,
  FamilyTermCheckGuard,
  JwtAuthGuard,
  MemberFamilyGuard,
} from '../../utils';
import { ChecklistService } from './checklist.service';
import { CreateChecklistDto } from './dto/createChecklist.dto';
import { UpdateChecklistDto } from './dto/updateChecklist.dto';

@ApiTags('Checklist')
@Controller('checklist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, FamilyTermCheckGuard, MemberFamilyGuard)
export class ChecklistController {
  constructor(private readonly checkListService: ChecklistService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get checklist type' })
  @Get('getChecklistTypes')
  async getChecklistTypes() {
    return this.checkListService.getChecklistTypes();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all checklist of family' })
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiQuery({ name: 'itemsPerPage', required: true, type: Number })
  @Get('getAllChecklist/:id_family')
  async getAllChecklist(
    @CurrentUser() currentUser,
    @Param('id_family') id_family: number,
    @Query('page') page: number,
    @Query('itemsPerPage') itemsPerPage: number,
  ) {
    return this.checkListService.getAllChecklist(
      currentUser.id_user,
      id_family,
      page,
      itemsPerPage,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create checklist of family' })
  @Post('createChecklist')
  async createChecklist(
    @CurrentUser() currentUser,
    @Body() dto: CreateChecklistDto,
  ) {
    return this.checkListService.createChecklist(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update checklist of family' })
  @Put('updateChecklist')
  async updateChecklist(
    @CurrentUser() currentUser,
    @Body() dto: UpdateChecklistDto,
  ) {
    return this.checkListService.updateChecklist(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete checklist of family' })
  @ApiParam({ name: 'id_checklist', required: true, type: Number })
  @ApiParam({ name: 'id_family', required: true, type: Number })
  @Delete('deleteChecklist/:id_checklist/:id_family')
  async deleteChecklist(
    @CurrentUser() currentUser,
    @Param('id_checklist') id_checklist: number,
    @Param('id_family') id_family: number,
  ) {
    return this.checkListService.deleteChecklist(
      currentUser.id_user,
      id_checklist,
      id_family,
    );
  }
}
