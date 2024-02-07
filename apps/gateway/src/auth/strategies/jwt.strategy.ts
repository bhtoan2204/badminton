import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AUTH_SERVICE } from 'apps/gateway/constant/services.constant';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, lastValueFrom, throwError, timeout } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(AUTH_SERVICE) private authClient: ClientProxy,
    private readonly configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')
    });
  }

  async validate(payload: any) {
    try {
      const userRequest = await this.authClient.send('authClient/validate_user_id', {id: payload.id}).pipe(
        timeout(5000),
        catchError(err => {
          return throwError(() => new Error(`Failed to get JWT secret: ${err}`));
        })
      );
      return await lastValueFrom(userRequest);
    }
    catch (err) {
      throw new UnauthorizedException("validate strategy:" + err)
    }
  }
}