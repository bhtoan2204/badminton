import { Module } from '@nestjs/common';
import { RefreshTokenController } from './refreshToken.controller';
import { RefreshTokenService } from './refreshToken.service';
import { DatabaseModule, RefreshToken, RmqModule } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    RmqModule,
    DatabaseModule,
    TypeOrmModule.forFeature([RefreshToken]),
  ],
  controllers: [RefreshTokenController],
  providers: [RefreshTokenService],
})
export class RefreshTokenModule {}
