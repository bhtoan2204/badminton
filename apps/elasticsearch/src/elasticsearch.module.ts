import { Module } from '@nestjs/common';
import { SearchController } from './elasticsearch.controller';
import { SearchService } from './elasticsearch.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RmqModule } from '@app/common';

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
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule { }
