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
    ) {}

  @EventPattern('authClient/create_account')
  async handleUserCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    const payload : CreateAccountDto = data.createAccountDto;
    return await this.userService.createAccount(payload);
  }

  @EventPattern('authClient/validate_user')
  async handleValidateUser(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    const {email, password} = data;
    return await this.userService.validateLocalUser(email, password);
  }
}