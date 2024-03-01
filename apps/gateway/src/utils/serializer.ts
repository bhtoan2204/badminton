import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AUTH_SERVICE } from './constant/services.constant';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject(AUTH_SERVICE) private readonly clientProxy: ClientProxy,
  ) {
    super();
  }

  serializeUser(user: any, done: Function) {
    done(null, user);
  }

  async deserializeUser(payload: any, done: Function) {
    const source = this.clientProxy.send('authClient/validate_user_id', { id_user: payload.id_user }).pipe(
      timeout(5000)
    );
    const user = await lastValueFrom(source);
    return user ? done(null, user) : done(null, null);
  }
}
