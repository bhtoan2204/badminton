import { forwardRef, Module } from '@nestjs/common';
import { SearchModule } from './search/search.module';
import { ProxyModule } from './proxy/proxy.module';
import { RabbitMqModule } from './rabbitmq/rabbitmq.module';
import { PostgresqlModule } from './postgresql/datastats.module';
import { DatafetcherModule } from './datafetcher/datafetcher.module';
import { RmqModule } from '@app/common';
import { ELASTICSEARCH_SERVICE } from '../utils';
import { PackageModule } from './package/package.module';

@Module({
  imports: [
    forwardRef(() => SearchModule),
    forwardRef(() => ProxyModule),
    forwardRef(() => RabbitMqModule),
    forwardRef(() => PostgresqlModule),
    forwardRef(() => DatafetcherModule),
    forwardRef(() => PackageModule),
    RmqModule.register({ name: ELASTICSEARCH_SERVICE }),
  ],
  exports: [RmqModule],
})
export class AdminModule {}
