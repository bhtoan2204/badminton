import { NestFactory } from '@nestjs/core';
import { HouseholdModule } from './household.module';
import { GrpcService, initTracing, RmqService } from '@app/common';

async function bootstrap() {
  await initTracing('household');
  const app = await NestFactory.create(HouseholdModule);
  const rmqService = app.get<RmqService>(RmqService);

  app.connectMicroservice(rmqService.getOptions('HOUSEHOLD'));
  app.startAllMicroservices();

  const grpcService = app.get(GrpcService);
  app.connectMicroservice(grpcService.getOptions('HOUSEHOLD'));

  await app.init();
}
bootstrap();
