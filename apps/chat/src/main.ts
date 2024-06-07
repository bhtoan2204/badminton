import { NestFactory } from '@nestjs/core';
import { ChatModule } from './chat.module';
import { RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(ChatModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('CHAT'));
  app.startAllMicroservices();
  await app.init();
}
bootstrap();
