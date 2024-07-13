import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { AUTH_SERVICE } from '..';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'admin') {
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
      const userRequest$ = this.authClient
        .send('authClient/validateUser', { email, password })
        .pipe(timeout(15000));
      const user$ = await lastValueFrom(userRequest$);
      if (user$.isadmin) {
        return user$;
      } else {
        throw new UnauthorizedException('You are not an admin user');
      }
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
