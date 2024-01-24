import { RmqService } from "@app/common";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";
import { Controller } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { LoginDto } from "./user/dto/login.dto";

@Controller()
export class AuthenticationController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly authenticationService: AuthenticationService
  ){}

  @EventPattern('authClient/local/login')
  async handleLocalLogin(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    const payload : LoginDto = data.loginDto;
    return await this.authenticationService.localLogin(payload);
  }
}