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

  @EventPattern('userClient/create_account')
  async handleUserCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.userService.createAccount(data.createAccountDto);
  }

  @EventPattern('userClient/change_password')
  async handleChangePassword(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.userService.changePassword(data.currentUser, data.data);
  }

  @EventPattern('userClient/update_profile')
  async handleUpdateProfile(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.userService.updateProfile(data.user, data.data);
  }

  @EventPattern('userClient/change_avatar')
  async handleChangeAvatar(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.userService.changeAvatar(data);
  }

  @EventPattern('userClient/validate_email')
  async handleValidateEmail(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.userService.validateEmail(data);
  }

  @EventPattern('userClient/get_all_user')
  async handleGetAllUser(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.userService.getAllUser();
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

  @EventPattern('mailClient/sendResetPassword')
  async sendResetPassword(@Payload() dto: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.userService.sendResetPassword(dto);
  }
}
