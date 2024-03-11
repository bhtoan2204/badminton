import { NestFactory } from '@nestjs/core';
import { RoleModule } from './role.module';
import { RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(RoleModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('ROLE'));
  app.startAllMicroservices();
  await app.init()
}
bootstrap();
