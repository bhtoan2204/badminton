import { NestFactory } from '@nestjs/core';
import { CalendarModule } from './calendar.module';
import { initTracing, RmqService } from '@app/common';

async function bootstrap() {
  await initTracing('calendar');
  const app = await NestFactory.create(CalendarModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('CALENDAR'));
  app.startAllMicroservices();
  await app.init();
}
bootstrap();
