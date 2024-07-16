import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AUTH_SERVICE } from '../constant/services.constant';
import { ClientProxy } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject(AUTH_SERVICE) private readonly clientProxy: ClientProxy,
    private readonly rmqService: RmqService,
  ) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  serializeUser(user: any, done: Function) {
    done(null, user);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async deserializeUser(payload: any, done: Function) {
    const user = await this.rmqService.send(
      this.clientProxy,
      'authClient/validateUserId',
      { id_user: payload.id_user },
    );
    return user ? done(null, user) : done(null, null);
  }
}
