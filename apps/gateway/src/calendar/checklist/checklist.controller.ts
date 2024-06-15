import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard, MemberFamilyGuard } from '../../utils';
import { CalendarService } from '../calendar.service';

@ApiTags('Checklist')
@Controller('checklist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, MemberFamilyGuard)
export class ChecklistController {
  constructor(
    private readonly calendarService: CalendarService,
  ){}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all checklist of family' })
  @Get('getAllChecklist/:id_family')
  async getAllChecklist(
    @CurrentUser() currentUser,
    @Param('id_family') id_family: number,
  ) {
    return this.calendarService.getAllChecklist(currentUser.id_user, id_family);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create checklist of family' })
  @Post('createChecklist')
  async createChecklist(
    @CurrentUser() currentUser,
    @Body() dto: any,
  ) {
    return this.calendarService.createChecklist(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update checklist of family' })
  @Put('updateChecklist')
  async updateChecklist(
    @CurrentUser() currentUser,
    @Body() dto: any,
  ) {
    return this.calendarService.updateChecklist(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete checklist of family' })
  @Delete('deleteChecklist/:id_checklist')
  async deleteChecklist(
    @CurrentUser() currentUser,
    @Param('id_checklist') id_checklist: number,
  ) {
    return this.calendarService.deleteChecklist(currentUser.id_user, id_checklist);
  }
}
