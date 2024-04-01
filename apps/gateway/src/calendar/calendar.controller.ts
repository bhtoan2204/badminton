import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards, UseInterceptors } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { CalendarService } from "./calendar.service";
import { CurrentUser, LoggingInterceptor } from "../utils";
import { CreateCalendarDto } from "./dto/createCalendar.dto";
import { UpdateCalendarDto } from "./dto/updateCalendar.dto";

@ApiTags('Calendar')
@Controller('calendar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) { }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all event of family' })
  @ApiParam({ name: 'id_family', required: true })
  @Get('getAllCalendar/:id_family')
  async getAllCalendar(@CurrentUser() currentUser, @Param('id_family') id_family: number) {
    return this.calendarService.getAllCalendar(currentUser.id_user, id_family);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Calendar detail' })
  @ApiParam({ name: 'id_calendar', required: true })
  @Get('getCalendarDetail/:id_calendar')
  async getCalendarDetail(@CurrentUser() currentUser, @Param('id_calendar') id_calendar: number) {
    return this.calendarService.getCalendarDetail(currentUser.id_user, id_calendar);
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
  async updateCalendar(@CurrentUser() currentUser, @Body() dto: UpdateCalendarDto) {
    return this.calendarService.updateCalendar(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a Calendar' })
  @ApiParam({ name: 'id_calendar', required: true })
  @Delete('deleteCalendar/:id_calendar')
  async deleteCalendar(@CurrentUser() currentUser, @Param('id_calendar') id_calendar: number) {
    return this.calendarService.deleteCalendar(currentUser.id_user, id_calendar);
  }
}