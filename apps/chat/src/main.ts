import { NestFactory } from '@nestjs/core';
import { ChatModule } from './chat.module';
import { initTracing, RmqService } from '@app/common';

async function bootstrap() {
  await initTracing('chat');
  const app = await NestFactory.create(ChatModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('CHAT'));
  app.startAllMicroservices();
  await app.init();
}
bootstrap();
