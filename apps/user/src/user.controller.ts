import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";
import { RmqService } from "@app/common";
import { UserService } from "./user.service";
import { CreateAccountDto } from "./dto/createAccount.dto";

@Controller()
export class UserController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly userService: UserService
  ) { }

  @EventPattern('userClient/create_account')
  async handleUserCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    const payload: CreateAccountDto = data.createAccountDto;
    return await this.userService.createAccount(payload);
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
}