import { Module, forwardRef } from '@nestjs/common';
import { SearchController } from './elasticsearch.controller';
import { SearchService } from './elasticsearch.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RmqModule } from '@app/common';
import { ProxyModule } from './proxy/proxy.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? './apps/elasticsearch/.env.production' : './apps/elasticsearch/.env',
    }),
    ElasticsearchModule.registerAsync({
      imports : [ConfigModule],
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
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [RmqModule],
})
export class SearchModule { }
