import { NestFactory } from '@nestjs/core';
import { GuidelineModule } from './guideline.module';
import { RmqService } from '@app/common';
import EventEmitter from 'events';

async function bootstrap() {
  const app = await NestFactory.create(GuidelineModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('GUIDELINE'));
  app.startAllMicroservices();
  EventEmitter.defaultMaxListeners = 30;
  await app.init();
}
bootstrap();
