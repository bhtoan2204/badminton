import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { AuthApiController } from './auth.controller';
import { AuthApiService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { GoogleStrategy } from './strategies/oauth.strategy/google.strategy';
import { SessionSerializer } from 'apps/gateway/src/utils/serializer';
import { AUTH_SERVICE } from '../utils/constant/services.constant';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        RmqModule.register({ name: AUTH_SERVICE }),
        UserModule
    ],
    controllers: [AuthApiController],
    providers: [
        AuthApiService, 
        LocalStrategy, 
        JwtStrategy, 
        RefreshStrategy,
        GoogleStrategy,
        SessionSerializer
    ],
})
export class AuthApiModule { }
