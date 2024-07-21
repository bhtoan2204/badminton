import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { WsException } from '@nestjs/websockets';
import { Strategy } from 'passport-jwt';
import { AUTH_SERVICE } from '../../constant/services.constant';
import { ClientProxy } from '@nestjs/microservices';
import { RmqService } from '@app/common';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class WsJwtStrategy extends PassportStrategy(Strategy, 'ws-jwt') {
  constructor(
    @Inject(AUTH_SERVICE) private authClient: ClientProxy,
    @InjectRedis() private readonly redisService: Redis,
    private readonly configService: ConfigService,
    private readonly rmqService: RmqService,
  ) {
    super({
      jwtFromRequest: (req) => {
        const authHeader = req.handshake.auth.authorization;
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
    console.log('goes here');
    const cacheKey = `user:${payload.id_user}`;
    try {
      const cachedUser = await this.redisService.get(cacheKey);
      if (cachedUser) {
        return JSON.parse(cachedUser);
      }
      const user = await this.rmqService.send(
        this.authClient,
        'authClient/validateUserId',
        { id_user: payload.id_user },
      );
      await this.redisService.set(cacheKey, JSON.stringify(user), 'EX', 3600);
      return user;
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
