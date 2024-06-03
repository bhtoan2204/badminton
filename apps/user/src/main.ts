import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { RmqService } from '@app/common';
import EventEmitter from 'events';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('USER'));
  app.startAllMicroservices();
  EventEmitter.defaultMaxListeners = 30;
  await app.init();
}
bootstrap();
