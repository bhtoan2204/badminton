import { NestFactory } from '@nestjs/core';
import { InvoiceModule } from './invoice.module';
import { RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(InvoiceModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('INVOICE'));
  app.startAllMicroservices();
  await app.init();
}
bootstrap();
