import { NestFactory } from '@nestjs/core';
import { CrawlerModule } from './crawler.module';
import { RmqService } from '@app/common';
import EventEmitter from 'events';

async function bootstrap() {
  const app = await NestFactory.create(CrawlerModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('CRAWLER'));
  app.startAllMicroservices();
  EventEmitter.defaultMaxListeners = 30;
  await app.init();
}
bootstrap();
