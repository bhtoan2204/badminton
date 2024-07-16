import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from '..';
import { RmqService } from '@app/common';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(
    @Inject(AUTH_SERVICE) private authClient: ClientProxy,
    private readonly rmqService: RmqService,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(request: any, email: string, password: string) {
    return this.validateUser(email, password);
  }

  private async validateUser(email: string, password: string) {
    try {
      const user$ = await this.rmqService.send(
        this.authClient,
        'authClient/validateUser',
        { email, password },
      );
      if (user$.isadmin) {
        return user$;
      } else {
        throw new UnauthorizedException('You are not an admin user');
      }
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
