import { RmqService } from '@app/common';
import { Controller } from '@nestjs/common';
import { RefreshTokenService } from './refreshToken.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class RefreshTokenController {
  constructor(
    private readonly refreshTokenService: RefreshTokenService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('authClient/getTopUsersLogin')
  async getTop10UserLogin(@Ctx() context: RmqContext, @Payload() data: any) {
    this.rmqService.ack(context);
    return this.refreshTokenService.getTopUserLogin(data.limit);
  }
}
