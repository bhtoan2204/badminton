import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AUTH_SERVICE } from 'apps/gateway/constant/services.constant';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, lastValueFrom, throwError, timeout } from 'rxjs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(AUTH_SERVICE) private authClient: ClientProxy
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: async (request, jwtToken, done) => {
        const source = this.authClient.send('authClient/get_jwt_secret', {}).pipe(
          timeout(5000),
          catchError(err => {
            done(new Error(`Failed to get JWT secret: ${err.message}`), null);
            return throwError(() => new Error(`Failed to get JWT secret: ${err}`));
          })
        );
        const data = await lastValueFrom(source);
        done(null, data);
      }
    });
  }

  async validate(payload: any) {
    try {
      const userRequest = await this.authClient.send('authClient/validate_user_id', {id: payload.id});
      return await lastValueFrom(userRequest);
    }
    catch (err) {
      throw new UnauthorizedException("validate strategy:" + err)
    }
  }
}