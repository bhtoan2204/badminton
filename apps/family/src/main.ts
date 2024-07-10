import { NestFactory } from '@nestjs/core';
import { FamilyModule } from './family.module';
import { initTracing, RmqService } from '@app/common';

async function bootstrap() {
  await initTracing('family');
  const app = await NestFactory.create(FamilyModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('FAMILY'));
  app.startAllMicroservices();
  await app.init();
}
bootstrap();
