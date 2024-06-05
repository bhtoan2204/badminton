import { NestFactory } from '@nestjs/core';
import { SearchModule } from './elasticsearch.module';
import { RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(SearchModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('ELASTICSEARCH'));
  app.startAllMicroservices();
  await app.init();
}
bootstrap();