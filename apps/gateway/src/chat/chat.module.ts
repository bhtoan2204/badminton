import { GlobalJwtModule, RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import {
  AUTH_SERVICE,
  CHAT_SERVICE,
  FAMILY_SERVICE,
  WsJwtStrategy,
} from '../utils';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisClientOptions } from 'redis';

@Module({
  imports: [
    RmqModule.register({ name: CHAT_SERVICE }),
    RmqModule.register({ name: AUTH_SERVICE }),
    RmqModule.register({ name: FAMILY_SERVICE }),
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        host: configService.get('REDIS_HOST', 'redis'),
        port: configService.get('REDIS_PORT', 6379),
        password: configService.get('REDIS_PASSWORD', undefined),
        ttl: 0,
      }),
      inject: [ConfigService],
    }),
    GlobalJwtModule,
  ],
  controllers: [ChatController],
  providers: [ChatGateway, WsJwtStrategy, ChatService],
})
export class ChatModule {}
