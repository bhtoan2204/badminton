import { NestFactory } from '@nestjs/core';
import { SearchModule } from './elasticsearch.module';
import { RmqService } from '@app/common';
import EventEmitter from 'events';

async function bootstrap() {
  const app = await NestFactory.create(SearchModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('ELASTICSEARCH'));
  app.startAllMicroservices();
  EventEmitter.defaultMaxListeners = 30;
  await app.init();
}
bootstrap();
