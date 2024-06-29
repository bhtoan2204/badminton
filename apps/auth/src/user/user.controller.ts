import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly userService: UserService,
  ) {}

  @EventPattern('authClient/create_account')
  async handleUserCreated(@Payload() dto: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.userService.createAccount(dto);
  }

  @EventPattern('authClient/get_profile')
  async handleGetProfile(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.userService.getProfile(data);
  }

  @EventPattern('authClient/change_password')
  async handleChangePassword(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.userService.changePassword(data.currentUser, data.data);
  }

  @EventPattern('authClient/forgot_password')
  async handleForgotPassword(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.userService.forgotPassword(data);
  }

  @EventPattern('authClient/update_profile')
  async handleUpdateProfile(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.userService.updateProfile(data.user, data.data);
  }

  @EventPattern('authClient/change_avatar')
  async handleChangeAvatar(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.userService.changeAvatar(data);
  }

  @EventPattern('authClient/validate_email')
  async handleValidateEmail(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.userService.validateEmail(data);
  }

  @EventPattern('mailClient/sendUserConfirmation')
  async sendUserConfirmation(@Payload() dto: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.userService.sendUserConfirmation(dto);
  }

  @EventPattern('mailClient/sendInvitation')
  async sendInvite(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.userService.sendInvite(data.id_user, data.id_family);
  }

  @EventPattern('authClient/check_otp')
  async handleCheckOTP(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.userService.checkOTP(data);
  }

  @EventPattern('authClient/reset_password')
  async handleResetPassword(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.userService.resetPassword(data);
  }
}
