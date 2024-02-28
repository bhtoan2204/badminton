import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { AUTH_SERVICE } from 'apps/gateway/src/utils/constant/services.constant';
import { AuthApiController, UserController } from './auth.controller';
import { AuthApiService, UserService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { GoogleStrategy } from './strategies/oauth.strategy/google.strategy';
import { SessionSerializer } from 'apps/gateway/src/utils/serializer';

@Module({
    imports: [
        RmqModule.register({ name: AUTH_SERVICE }),
    ],
    controllers: [AuthApiController, UserController],
    providers: [
        AuthApiService, 
        UserService, 
        LocalStrategy, 
        JwtStrategy, 
        RefreshStrategy,
        GoogleStrategy,
        SessionSerializer
    ],
})
export class AuthApiModule { }
