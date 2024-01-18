import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly rmqService: RmqService) { }

  @EventPattern('local_login')
  async handleOrderCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return { message: 'Hello Auth!', returnData: data };
  }
}
