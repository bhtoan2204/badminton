import { NestFactory } from '@nestjs/core';
import { StorageModule } from './storage.module';
import { GrpcService } from '@app/common';
import EventEmitter from 'events';

async function bootstrap() {
  const app = await NestFactory.create(StorageModule);
  const grpcService = app.get(GrpcService);
  app.connectMicroservice(grpcService.getOptions('STORAGE'));
  app.startAllMicroservices();
  EventEmitter.defaultMaxListeners = 30;
  await app.init();
}
bootstrap();
