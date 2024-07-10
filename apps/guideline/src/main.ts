import { NestFactory } from '@nestjs/core';
import { GuidelineModule } from './guideline.module';
import { initTracing, RmqService } from '@app/common';

async function bootstrap() {
  await initTracing('guideline');
  const app = await NestFactory.create(GuidelineModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('GUIDELINE'));
  app.startAllMicroservices();
  await app.init();
}
bootstrap();
