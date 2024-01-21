import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor() {
        super({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true,
        });
    }

    async validate(request: any) {
        // return this.usersService.validateLocalUser(request.body.email, request.body.password);
    }
}