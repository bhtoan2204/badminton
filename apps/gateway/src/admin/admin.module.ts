import { Module } from '@nestjs/common';
import { SearchModule } from './search/search.module';
import { ProxyModule } from './proxy/proxy.module';
import { RabbitMqModule } from './rabbitmq/rabbitmq.module';
import { PostgresqlModule } from './postgresql/datastats.module';
import { DatafetcherModule } from './datafetcher/datafetcher.module';

@Module({
  imports: [
    SearchModule,
    ProxyModule,
    RabbitMqModule,
    PostgresqlModule,
    DatafetcherModule,
  ],
})
export class AdminModule {}
