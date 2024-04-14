import { NestFactory } from '@nestjs/core';
import { HouseholdModule } from './household.module';
import { RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(HouseholdModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('HOUSEHOLD'));
  app.startAllMicroservices();
  await app.init();
}
bootstrap();
