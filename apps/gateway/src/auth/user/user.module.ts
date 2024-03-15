import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AUTH_SERVICE } from '../../utils/constant/services.constant';

@Module({
    imports: [
        RmqModule.register({ name: AUTH_SERVICE }),
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule { }
