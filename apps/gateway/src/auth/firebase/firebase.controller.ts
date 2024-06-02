import { Body, Controller, Delete, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FirebaseService } from "./firebase.service";
import { CurrentUser, JwtAuthGuard } from "../../utils";

@ApiTags('Firebase Authentication')
@Controller('auth/firebase')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class FirebaseController {
  constructor(
    private readonly firebaseService: FirebaseService
  ) {}

  @ApiOperation({ summary: 'Save FCM Token' })
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    description: 'FCM token to be saved',
    schema: {
      type: 'object',
      properties: {
        fcmToken: { type: 'string' },
      },
    },
  })
  @Post('saveFCMToken')
  async saveToken(@CurrentUser() user, @Body('fcmToken') fcmToken: string) {
    return this.firebaseService.saveFCMToken(user.id_user, fcmToken);
  }

  @ApiOperation({ summary: 'Delete FCM Token' })
  @HttpCode(204)
  @ApiBody({
    description: 'FCM token',
    schema: {
      type: 'object',
      properties: {
        fcmToken: { type: 'string' },
      },
    },
  })
  @Delete('deleteFCMToken')
  async deleteToken(@CurrentUser() user, @Body('fcmToken') fcmToken: string) {
    return this.firebaseService.deleteFCMToken(user.id_user, fcmToken);
  }
}