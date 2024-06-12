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
  ApiTags,
} from '@nestjs/swagger';
import { CalendarService } from './calendar.service';
import { CurrentUser, JwtAuthGuard, MemberFamilyGuard } from '../utils';
import { CreateCalendarDto } from './dto/createCalendar.dto';
import { UpdateCalendarDto } from './dto/updateCalendar.dto';
import { GetEventDTO } from './dto/getEvent.dto';
import { CreateCategoryEventDto } from './dto/createCategoryEvent.dto';
import { UpdateCategoryEventDto } from './dto/updateCategoryEvent.dto';

@ApiTags('Calendar')
@Controller('calendar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, MemberFamilyGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all category event of family' })
  @Get('getAllCategoryEvent')
  async getAllCategoryEvent(
    @CurrentUser() currentUser,
    @Query('id_family') id_family: number,
  ) {
    return this.calendarService.getAllCategoryEvent(
      currentUser.id_user,
      id_family,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create category event of family' })
  @Post('createCategoryEvent')
  async createCategoryEvent(
    @CurrentUser() currentUser,
    @Body() dto: CreateCategoryEventDto,
  ) {
    return this.calendarService.createCategoryEvent(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update category event of family' })
  @Put('updateCategoryEvent')
  async updateCategoryEvent(
    @CurrentUser() currentUser,
    @Body() dto: UpdateCategoryEventDto,
  ) {
    return this.calendarService.updateCategoryEvent(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete category event of family' })
  @ApiParam({ name: 'id_family', required: true })
  @Delete('deleteCategoryEvent/:id_family')
  async deleteCategoryEvent(
    @CurrentUser() currentUser,
    @Param('id_family') id_family: number,
    @Query('id_category_event') id_category_event: number,
  ) {
    return this.calendarService.deleteCategoryEvent(
      currentUser.id_user,
      id_family,
      id_category_event,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all event of family' })
  @ApiParam({ name: 'id_family', required: true })
  @Get('getAllCalendar/:id_family')
  async getAllCalendar(
    @CurrentUser() currentUser,
    @Param('id_family') id_family: number,
  ) {
    return this.calendarService.getAllCalendar(currentUser.id_user, id_family);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get events for family on date' })
  @Post('getEventOnDate')
  async getEventOnDate(@CurrentUser() currentUser, @Body() dto: GetEventDTO) {
    return this.calendarService.getEventOnDate(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Calendar detail' })
  @ApiParam({ name: 'id_calendar', required: true })
  @Get('getCalendarDetail/:id_calendar')
  async getCalendarDetail(
    @CurrentUser() currentUser,
    @Param('id_calendar') id_calendar: number,
  ) {
    return this.calendarService.getCalendarDetail(
      currentUser.id_user,
      id_calendar,
    );
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a Calendar' })
  @Post('createCalendar')
  async createCalendar(
    @CurrentUser() currentUser,
    @Body() dto: CreateCalendarDto,
  ) {
    return this.calendarService.createCalendar(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a Calendar' })
  @Put('updateCalendar')
  async updateCalendar(
    @CurrentUser() currentUser,
    @Body() dto: UpdateCalendarDto,
  ) {
    return this.calendarService.updateCalendar(currentUser.id_user, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a Calendar' })
  @ApiParam({ name: 'id_calendar', required: true })
  @Delete('deleteCalendar/:id_calendar')
  async deleteCalendar(
    @CurrentUser() currentUser,
    @Param('id_calendar') id_calendar: number,
  ) {
    return this.calendarService.deleteCalendar(
      currentUser.id_user,
      id_calendar,
    );
  }
}
