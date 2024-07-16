import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AUTH_SERVICE } from '../../utils';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { RmqService } from '@app/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(AUTH_SERVICE) private authClient: ClientProxy,
    private readonly configService: ConfigService,
    @InjectRedis() private readonly redisService: Redis,
    private readonly rmqService: RmqService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return this.validateUser(payload);
  }

  private async validateUser(payload: any) {
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
      await this.redisService.set(cacheKey, JSON.stringify(user), 'EX', 3600); // Cache for 1 hour
      return user;
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
