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

  @EventPattern('authClient/get_jwt_secret')
  async handleGetJwtSecret(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.authenticationService.getJwtSecret();
  }

  @EventPattern('authClient/get_jwt_secret_refresh')
  async handleGetJwtSecretRefresh(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.authenticationService.getJwtSecretRefresh();
  }

  @EventPattern('authClient/refresh_token')
  async handleRefreshToken(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.authenticationService.refreshToken(data);
  }

  @EventPattern('authClient/get_google_config')
  async getGoogleConfig(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return await this.authenticationService.getGoogleConfig();
  }
}