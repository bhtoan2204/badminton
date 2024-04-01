import { RmqService } from "@app/common";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";
import { Controller } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller()
export class AuthController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly authService: AuthService
  ) { }

  @EventPattern('authClient/local/login')
  async handleLocalLogin(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.authService.localLogin(data);
  }

  @EventPattern('authClient/google_login')
  async handleGoogleLogin(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.authService.googleValidate(data.accessToken, data.profile);
  }

  @EventPattern('authClient/facebook_login')
  async handleFacebookLogin(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.authService.facebookValidate(data.accessToken, data.profile);
  }

  @EventPattern('authClient/refresh_token')
  async handleRefreshToken(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.authService.refreshToken(data.currentUser, data.refreshToken);
  }

  @EventPattern('authClient/logout')
  async handleLogout(@Payload() refreshToken, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.authService.logout(refreshToken);
  }

  @EventPattern('authClient/validate_user_id')
  async handleValidateUserId(@Payload() id_user: string, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.authService.validateUserId(id_user);
  }

  @EventPattern('authClient/validate_user')
  async handleValidateUser(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    const { email, password } = data;
    return await this.authService.validateLocalUser(email, password);
  }
}