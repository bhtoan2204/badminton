import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { RmqService } from '@app/common/rmq/rmq.service';
import { initTracing } from '@app/common';

async function bootstrap() {
  await initTracing('auth');
  const app = await NestFactory.create(AuthModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('AUTH'));
  app.startAllMicroservices();
  await app.init();
}
bootstrap();
