import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, lastValueFrom, throwError, timeout } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { AUTH_SERVICE } from 'apps/gateway/constant/services.constant';

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
    return this.validateUser(payload);
  }

  private async validateUser(payload: any) {
    const userRequest$ = this.authClient.send('authClient/validate_user_id', {id: payload.id}).pipe(
      timeout(5000)
    );

    try {
      return await lastValueFrom(userRequest$);
    }
    catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
