import { NestFactory } from '@nestjs/core';
import { SmsModule } from './sms.module';
import { RmqService } from '@app/common';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(SmsModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('SMS'));
  await app.startAllMicroservices();
}
bootstrap();
