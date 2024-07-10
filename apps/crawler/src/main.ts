import { NestFactory } from '@nestjs/core';
import { CrawlerModule } from './crawler.module';
import { initTracing, RmqService } from '@app/common';

async function bootstrap() {
  await initTracing('crawler');
  const app = await NestFactory.create(CrawlerModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('CRAWLER'));
  app.startAllMicroservices();
  await app.init();
}
bootstrap();
