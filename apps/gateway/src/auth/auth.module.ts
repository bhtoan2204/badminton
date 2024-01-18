import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { AUTH_SERVICE } from 'apps/gateway/constant/services.constant';
import { AuthApiController } from './auth.controller';
import { AuthApiService } from './auth.service';

@Module({
    imports: [
        RmqModule.register({ name: AUTH_SERVICE }),
    ],
    controllers: [AuthApiController],
    providers: [AuthApiService],
})
export class AuthApiModule { }
