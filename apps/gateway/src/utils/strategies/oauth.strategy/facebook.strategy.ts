import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { AUTH_SERVICE } from '../../../utils';
import { RmqService } from '@app/common';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    @Inject(AUTH_SERVICE) private authClient: ClientProxy,
    private readonly configService: ConfigService,
    private readonly rmqService: RmqService,
  ) {
    super({
      clientID: configService.get<string>('FACEBOOK_CLIENT_ID'),
      clientSecret: configService.get<string>('FACEBOOK_CLIENT_SECRET'),
      callbackURL: configService.get<string>('FACEBOOK_REDIRECT_URI'),

      scope: ['email', 'public_profile'],
      profileFields: [
        'id',
        'emails',
        'name',
        'picture.type(large)',
        'birthday',
      ],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    try {
      return await this.rmqService.send(
        this.authClient,
        'authClient/facebook_login',
        {
          accessToken,
          profile,
        },
      );
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
