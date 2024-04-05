import { Controller, Get, HttpCode, HttpStatus, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { NotificationService } from "./notification.service";
import { CurrentUser } from "../utils";

@ApiTags('Notification')
@Controller('notification')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService
  ) { }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get notifications' })
  @Get('getNotifications/:index')
  @ApiParam({ name: 'index', required: true, description: 'Index', type: Number })
  async getNotifications(@CurrentUser() user, @Param('index') index: number) {
    return this.notificationService.getNotifications(user.id_user, index);
  }
}