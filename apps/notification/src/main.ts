import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('NOTIFICATION'));
  app.startAllMicroservices();
  await app.init()
}
bootstrap();
