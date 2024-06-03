import { NestFactory } from '@nestjs/core';
import { PaymentModule } from './payment.module';
import { RmqService } from '@app/common';
import EventEmitter from 'events';

async function bootstrap() {
  const app = await NestFactory.create(PaymentModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('PAYMENT'));
  app.startAllMicroservices();
  EventEmitter.defaultMaxListeners = 30;
  await app.init()
}
bootstrap();
