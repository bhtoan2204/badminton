import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { AUTH_SERVICE } from '../../utils';
import { logger } from '@app/common';

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
    try {
      const userRequest$ = this.authClient.send('authClient/validate_user_id', payload.id_user).pipe(
        timeout(5000)
      );
      return await lastValueFrom(userRequest$);
    }
    catch (error) {
      logger.error(error);
      throw new UnauthorizedException(error.message);
    }
  }
}
