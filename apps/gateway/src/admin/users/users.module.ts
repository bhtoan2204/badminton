import { RmqModule } from '@app/common';
import { forwardRef, Module } from '@nestjs/common';
import { AUTH_SERVICE } from '../../utils';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AdminModule } from '../admin.module';

@Module({
  imports: [
    RmqModule.register({ name: AUTH_SERVICE }),
    forwardRef(() => AdminModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
