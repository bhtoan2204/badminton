import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AUTH_SERVICE } from 'apps/gateway/constant/services.constant';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(AUTH_SERVICE) private authClient: ClientProxy
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          return request?.authentication
        }
      ]),
      ignoreExpiration: false,
      secretOrKey: async () =>{
        const jwtSecretRequest = this.authClient.send('authClient/get_jwt_secret', {});
        return await lastValueFrom(jwtSecretRequest);
      },
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