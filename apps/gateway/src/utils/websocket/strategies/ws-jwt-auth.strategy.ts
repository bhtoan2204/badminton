import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { WsException } from '@nestjs/websockets';
import { Strategy } from 'passport-jwt';
import { AUTH_SERVICE } from '../../constant/services.constant';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';

@Injectable()
export class WsJwtStrategy extends PassportStrategy(Strategy, 'ws-jwt') {
  constructor(
    @Inject(AUTH_SERVICE) private authClient: ClientProxy,
    private readonly configService: ConfigService,
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
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const userRequest$ = this.authClient.send('authClient/validate_user_id', payload.id_user).pipe(
      timeout(5000)
    );
    try {
      const user = await lastValueFrom(userRequest$);
      return user;
    }
    catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
