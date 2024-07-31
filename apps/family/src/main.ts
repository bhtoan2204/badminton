import { NestFactory } from '@nestjs/core';
import { FamilyModule } from './family.module';
import { GrpcService, initTracing, RmqService } from '@app/common';

async function bootstrap() {
  await initTracing('family');
  const app = await NestFactory.create(FamilyModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('FAMILY'));

  const grpcService = app.get(GrpcService);
  app.connectMicroservice(grpcService.getOptions('FAMILY'));

  app.startAllMicroservices();
  await app.init();
}
bootstrap();
