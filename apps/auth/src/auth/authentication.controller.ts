import { RmqService } from "@app/common";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";
import { Controller } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";

@Controller()
export class AuthenticationController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly authenticationService: AuthenticationService
  ){}

  @EventPattern('authClient/local/login')
  async handleLocalLogin(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.authenticationService.localLogin(data);
  }

  @EventPattern('authClient/google_login')
  async handleGoogleLogin(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.authenticationService.googleValidate(data.accessToken, data.profile);
  }

  @EventPattern('authClient/facebook_login')
  async handleFacebookLogin(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.authenticationService.facebookValidate(data.accessToken, data.profile);
  }

  @EventPattern('authClient/refresh_token')
  async handleRefreshToken(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.authenticationService.refreshToken(data.currentUser, data.refreshToken);
  }

  @EventPattern('authClient/logout')
  async handleLogout(@Payload() refreshToken, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.authenticationService.logout(refreshToken);
  }
}