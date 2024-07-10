import { NestFactory } from '@nestjs/core';
import { PaymentModule } from './payment.module';
import { initTracing, RmqService } from '@app/common';

async function bootstrap() {
  await initTracing('payment');
  const app = await NestFactory.create(PaymentModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('PAYMENT'));
  app.startAllMicroservices();
  await app.init();
}
bootstrap();
