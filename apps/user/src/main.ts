import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('USER'));
  app.startAllMicroservices();
  await app.init();
}
bootstrap();
