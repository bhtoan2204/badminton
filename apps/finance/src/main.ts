import { NestFactory } from '@nestjs/core';
import { FinanceModule } from './finance.module';
import { RmqService } from '@app/common';
import EventEmitter from 'events';

async function bootstrap() {
  const app = await NestFactory.create(FinanceModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('FINANCE'));
  app.startAllMicroservices();
  EventEmitter.defaultMaxListeners = 30;
  await app.init();
}
bootstrap();
