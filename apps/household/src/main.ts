import { NestFactory } from '@nestjs/core';
import { HouseholdModule } from './household.module';
import { GrpcService, initTracing, RmqService } from '@app/common';

async function bootstrap() {
  await initTracing('household');
  const app = await NestFactory.create(HouseholdModule);

  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('HOUSEHOLD'));

  const grpcService = app.get(GrpcService);
  app.connectMicroservice(grpcService.getOptions('HOUSEHOLD'));

  app.startAllMicroservices();
  await app.init();
}
bootstrap();
