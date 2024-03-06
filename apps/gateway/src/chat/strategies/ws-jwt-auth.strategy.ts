import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { WsException } from '@nestjs/websockets';
import { Strategy } from 'passport-jwt';
import { TokenPayload } from '../chat.gateway';
import { AUTH_SERVICE } from '../../utils/constant/services.constant';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';

@Injectable()
export class WsJwtStrategy extends PassportStrategy(Strategy, 'ws-jwt') {
  constructor(
    private readonly configService: ConfigService,
    @Inject(AUTH_SERVICE) private authClient: ClientProxy,
  ) {
    super({
      jwtFromRequest: (req) => {
        const authHeader = req.handshake.headers.authorization;
        if (!authHeader) {
          throw new WsException('Missing Authorization header');
        }
        return authHeader.split(' ')[1];
      },
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: TokenPayload) {
    const userRequest$ = this.authClient.send('authClient/validate_user_id', payload.id_user).pipe(
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
