import { NestFactory } from '@nestjs/core';
import { FamilyModule } from './family.module';
import { RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(FamilyModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('FAMILY'));
  await app.startAllMicroservices();
}
bootstrap();
