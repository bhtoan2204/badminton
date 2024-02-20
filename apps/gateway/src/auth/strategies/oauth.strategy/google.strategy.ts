import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from 'apps/gateway/constant/services.constant';
import { catchError, lastValueFrom, timeout } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(AUTH_SERVICE) private authClient: ClientProxy,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_REDIRECT_URI'),
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any> {
    try {
      const source = this.authClient.send('authClient/google_login', { accessToken, profile }).pipe(
        timeout(5000),
        catchError(err => {
          throw new Error(`Failed to login: ${err.message}`);
        })
      );
      return await lastValueFrom(source);
    }
    catch (err) {
      throw new UnauthorizedException('Credentials are not valid: ' + err.message);
    }
  }
}