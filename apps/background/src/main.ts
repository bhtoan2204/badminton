import { NestFactory } from '@nestjs/core';
import { BackgroundModule } from './background.module';
// import { RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(BackgroundModule);
  // const rmqService = app.get<RmqService>(RmqService);
  // app.connectMicroservice(rmqService.getOptions('BACKGROUND'));
  // app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
