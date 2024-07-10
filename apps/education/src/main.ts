import { NestFactory } from '@nestjs/core';
import { EducationModule } from './education.module';
import { initTracing, RmqService } from '@app/common';

async function bootstrap() {
  await initTracing('education');
  const app = await NestFactory.create(EducationModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('EDUCATION'));
  app.startAllMicroservices();
  await app.init();
}
bootstrap();
