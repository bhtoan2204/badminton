import { GrpcModule } from '@app/common';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';

@Module({
  imports: [GrpcModule.register({ name: 'USER' })],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
