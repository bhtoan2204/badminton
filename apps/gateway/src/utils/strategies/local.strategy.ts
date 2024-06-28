import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { lastValueFrom, timeout } from 'rxjs';
import { AUTH_SERVICE } from '../../utils';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(request: any, email: string, password: string) {
    return this.validateUser(email, password);
  }

  private async validateUser(email: string, password: string) {
    try {
      const userValidation$ = this.authClient
        .send('authClient/validateUser', { email, password })
        .pipe(timeout(15000));
      return await lastValueFrom(userValidation$);
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
