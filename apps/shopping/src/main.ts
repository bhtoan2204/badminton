import { NestFactory } from '@nestjs/core';
import { ShoppingModule } from './shopping.module';
import { initTracing, RmqService } from '@app/common';

async function bootstrap() {
  await initTracing('shopping');
  const app = await NestFactory.create(ShoppingModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('SHOPPING'));
  app.startAllMicroservices();
  await app.init();
}
bootstrap();
