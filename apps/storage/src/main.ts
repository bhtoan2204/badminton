import { NestFactory } from '@nestjs/core';
import { StorageModule } from './storage.module';
import { GrpcService, initTracing } from '@app/common';

async function bootstrap() {
  await initTracing('storage');
  const app = await NestFactory.create(StorageModule);
  const grpcService = app.get(GrpcService);
  app.connectMicroservice(grpcService.getOptions('STORAGE'));
  app.startAllMicroservices();
  await app.init();
}
bootstrap();
