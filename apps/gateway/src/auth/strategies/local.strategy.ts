import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PassportStrategy } from '@nestjs/passport';
import { AUTH_SERVICE } from 'apps/gateway/constant/services.constant';
import { Strategy } from 'passport-local';
import { catchError, lastValueFrom, timeout } from 'rxjs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    @Inject(AUTH_SERVICE) private authClient: ClientProxy
    ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    });
  }

  async validate(request: any, email: string, password: string) {
    try {
      const source = this.authClient.send('authClient/validate_user', {email, password}).pipe(
        timeout(5000),
        catchError(err => {
          throw new Error(`Failed to validate user: ${err.message}`);
        })
      );
      const user = await lastValueFrom(source);
      if (user) {
        request.user = user;
      }
      return user;
    }
    catch (err) {
      throw err
    }
  }
}