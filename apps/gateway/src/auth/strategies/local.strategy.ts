import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authClient: ClientProxy) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    });
  }

  async validate(request: any, email: string, password: string) {
    try {
      const source = this.authClient.send('authClient/validate_user', {email, password});
      const data = await lastValueFrom(source);
      return data;
    }
    catch (err) {
      throw err
    }
  }
}