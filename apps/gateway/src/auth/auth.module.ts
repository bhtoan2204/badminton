import { Module } from '@nestjs/common';
import { AuthApiController } from './auth.controller';
import { AuthApiService } from './auth.service';
import {
  SessionSerializer,
  LocalStrategy,
  JwtStrategy,
  RefreshStrategy,
  GoogleStrategy,
  FacebookStrategy,
  AdminStrategy,
} from '../utils';

@Module({
  imports: [],
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
})
export class AuthApiModule {}
