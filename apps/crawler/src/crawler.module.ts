import { Module, forwardRef } from '@nestjs/common';
import { CrawlerController } from './crawler.controller';
import { CrawlerService } from './crawler.service';
import { RssModule } from './rss/rss.module';
import { ConfigModule } from '@nestjs/config';
import { RmqModule } from '@app/common';
import { BankModule } from './bank/bank.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_CRAWLER_QUEUE: Joi.string().required(),
      }),
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? './apps/crawler/.env.production'
          : './apps/crawler/.env',
    }),
    forwardRef(() => RssModule),
    forwardRef(() => BankModule),
    RmqModule,
  ],
  controllers: [CrawlerController],
  providers: [CrawlerService],
  exports: [RmqModule],
})
export class CrawlerModule {}
