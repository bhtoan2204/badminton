import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { CurrentUser, JwtAuthGuard } from '../utils';

@ApiTags('Notification')
@Controller('notification')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get notifications' })
  @Get('getNotifications/:index')
  @ApiParam({
    name: 'index',
    required: true,
    description: 'Index',
    type: Number,
  })
  async getNotifications(@CurrentUser() user, @Param('index') index: number) {
    return this.notificationService.getNotifications(user.id_user, index);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark Read' })
  @Get('markRead/:id_notification')
  @ApiParam({
    name: 'id_notification',
    required: true,
    description: 'Notification ID',
    type: String,
  })
  async markRead(
    @CurrentUser() currentUser,
    @Param('id_notification') id_notification: string,
  ) {
    return this.notificationService.markRead(
      currentUser.id_user,
      id_notification,
    );
  }
}
