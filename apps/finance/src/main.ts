import { NestFactory } from '@nestjs/core';
import { FinanceModule } from './finance.module';
import { RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(FinanceModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('FINANCE'));
  app.startAllMicroservices();
  await app.init();
}
bootstrap();
