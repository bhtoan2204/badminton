import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from '../user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(
        private readonly userService: UserService,
    ) {
        super({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true,
        });
    }

    async validate(request: any) {
        console.log(request.body);
        return this.userService.validateLocalUser(request.body.email, request.body.password);
    }
}