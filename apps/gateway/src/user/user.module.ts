import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { USER_SERVICE } from '../utils';

@Module({
  imports: [RmqModule.register({ name: USER_SERVICE })],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
