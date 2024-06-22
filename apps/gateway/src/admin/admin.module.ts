import { forwardRef, Module } from '@nestjs/common';
import { SearchModule } from './search/search.module';
import { ProxyModule } from './proxy/proxy.module';
import { RabbitMqModule } from './rabbitmq/rabbitmq.module';
import { PostgresqlModule } from './postgresql/datastats.module';
import { DatafetcherModule } from './datafetcher/datafetcher.module';
import { RmqModule } from '@app/common';
import { ELASTICSEARCH_SERVICE } from '../utils';
import { PackageModule } from './package/package.module';
import { CacheModule, CacheStoreFactory } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    forwardRef(() => SearchModule),
    forwardRef(() => ProxyModule),
    forwardRef(() => RabbitMqModule),
    forwardRef(() => PostgresqlModule),
    forwardRef(() => DatafetcherModule),
    forwardRef(() => PackageModule),
    RmqModule.register({ name: ELASTICSEARCH_SERVICE }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore as unknown as CacheStoreFactory,
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
        no_ready_check: false,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [RmqModule, CacheModule],
})
export class AdminModule {}
