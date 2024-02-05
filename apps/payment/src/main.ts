import { NestFactory } from '@nestjs/core';
import { PaymentModule } from './payment.module';
import { RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(PaymentModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('PAYMENT'));
  await app.startAllMicroservices();
}
bootstrap();
