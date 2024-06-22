import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { USER_SERVICE } from '../utils';
import { ThrottlerModule, seconds } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    RmqModule.register({ name: USER_SERVICE }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        throttlers: [{ limit: 1, ttl: seconds(60) }],
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
