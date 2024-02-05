import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PassportStrategy } from '@nestjs/passport';
import { AUTH_SERVICE } from 'apps/gateway/constant/services.constant';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { catchError, lastValueFrom, throwError, timeout } from 'rxjs';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    @Inject(AUTH_SERVICE) private authClient: ClientProxy
    ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: async (request, jwtToken, done) => {
        const source = this.authClient.send('authClient/get_jwt_secret_refresh', {}).pipe(
          timeout(5000),
          catchError(err => {
            done(new Error(`Failed to get JWT secret: ${err.message}`), null);
            return throwError(() => new Error(`Failed to get JWT secret: ${err}`));
          })
        );
        const data = await lastValueFrom(source);
        done(null, data);
      },
    });
  }
  
  async validate(payload: any) {
    return payload;
  }
}
