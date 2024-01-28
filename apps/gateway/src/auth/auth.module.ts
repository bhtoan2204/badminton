import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { AUTH_SERVICE } from 'apps/gateway/constant/services.constant';
import { AuthApiController, UserController } from './auth.controller';
import { AuthApiService, UserService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        RmqModule.register({ name: AUTH_SERVICE }),
    ],
    controllers: [AuthApiController, UserController],
    providers: [AuthApiService, UserService, LocalStrategy, JwtStrategy],
})
export class AuthApiModule { }
