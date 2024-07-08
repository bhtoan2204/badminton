import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { AuthApiController } from './auth.controller';
import { AuthApiService } from './auth.service';
import {
  SessionSerializer,
  AUTH_SERVICE,
  LocalStrategy,
  JwtStrategy,
  RefreshStrategy,
  GoogleStrategy,
  FacebookStrategy,
  AdminStrategy,
} from '../utils';
// import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [
    RmqModule.register({ name: AUTH_SERVICE }),
    // forwardRef(() => FirebaseModule),
  ],
  controllers: [AuthApiController],
  providers: [
    AuthApiService,
    LocalStrategy,
    JwtStrategy,
    AdminStrategy,
    RefreshStrategy,
    GoogleStrategy,
    FacebookStrategy,
    SessionSerializer,
  ],
  exports: [RmqModule],
})
export class AuthApiModule {}
