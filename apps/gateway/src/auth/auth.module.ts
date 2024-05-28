import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { AuthApiController } from './auth.controller';
import { AuthApiService } from './auth.service';
import { SessionSerializer, AUTH_SERVICE, LocalStrategy, JwtStrategy, RefreshStrategy, GoogleStrategy, FacebookStrategy } from '../utils';

@Module({
    imports: [
        RmqModule.register({ name: AUTH_SERVICE })
    ],
    controllers: [AuthApiController],
    providers: [
        AuthApiService,
        LocalStrategy,
        JwtStrategy,
        RefreshStrategy,
        GoogleStrategy,
        FacebookStrategy,
        SessionSerializer
    ],
})
export class AuthApiModule { }
