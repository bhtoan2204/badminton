import { Module, forwardRef } from '@nestjs/common';
import { SearchController } from './elasticsearch.controller';
import { SearchService } from './elasticsearch.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RmqModule } from '@app/common';
import { RabbitMqModule } from './rabbitmq/rabbitmq.module';
import { ProxyModule } from './proxy/proxy.module';
import { DataStatsModule } from './postgresql/datastats.module';
import { DatafetcherModule } from './datafetcher/datafetcher.module';
import { PackageModule } from './packages/package.module';
import { GuidelineIndexerController } from './guideline_indexer.controller';
import { GuidelineIndexerService } from './guideline_indexer.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? './apps/elasticsearch/.env.production'
          : './apps/elasticsearch/.env',
    }),
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get<string>('ELASTICSEARCH_NODE'),
        auth: {
          username: configService.get<string>('ELASTICSEARCH_USERNAME'),
          password: configService.get<string>('ELASTICSEARCH_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    RmqModule,
    forwardRef(() => ProxyModule),
    forwardRef(() => RabbitMqModule),
    forwardRef(() => DataStatsModule),
    forwardRef(() => DatafetcherModule),
    forwardRef(() => PackageModule),
  ],
  controllers: [SearchController, GuidelineIndexerController],
  providers: [SearchService, GuidelineIndexerService],
  exports: [RmqModule],
})
export class SearchModule {}
