import { GlobalJwtModule } from '@app/common';
import { Module } from '@nestjs/common';
import { WsJwtStrategy } from '../utils';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisClientOptions } from 'redis';
import { BullModule } from '@nestjs/bull';
import { AuthProcessor, ChatProcessor } from './chat.processor';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'chats',
    }),
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
    NotificationModule,
  ],
  controllers: [ChatController],
  providers: [
    ChatGateway,
    WsJwtStrategy,
    ChatService,
    ChatProcessor,
    AuthProcessor,
  ],
})
export class ChatModule {}
