import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CalendarService } from "./calendar.service";
import { CurrentUser } from "../utils/decorator/current-user.decorator";
import { CreateCalendarDto } from "./dto/createCalendar.dto";

@ApiTags('Calendar')
@Controller('calendar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) { }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all Calendar' })
  @Get('getAllCalendar')
  async getAllCalendar(@CurrentUser() currentUser) {
    return this.calendarService.getAllCalendar(currentUser.id_user);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Calendar detail' })
  @Get('getCalendarDetail')
  async getCalendarDetail(@CurrentUser() currentUser) {
    return this.calendarService.getCalendarDetail();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a Calendar' })
  @Post('createCalendar')
  async createCalendar(@CurrentUser() currentUser, @Body() dto: CreateCalendarDto) {
    return this.calendarService.createCalendar(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a Calendar' })
  @Put('updateCalendar')
  async updateCalendar(@CurrentUser() currentUser) {
    return this.calendarService.updateCalendar();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a Calendar' })
  @Delete('deleteCalendar')
  async deleteCalendar(@CurrentUser() currentUser) {
    return this.calendarService.deleteCalendar();
  }
}