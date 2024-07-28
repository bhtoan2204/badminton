import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AUTH_SERVICE } from '../../utils';
import { RmqService } from '@app/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
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
      const user = await this.rmqService.send(
        this.authClient,
        'authClient/validateUser',
        { email, password },
      );
      if (user.isemailverified === false) {
        throw new UnauthorizedException('Email is not verified');
      }
      return user;
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
