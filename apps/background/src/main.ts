import { NestFactory } from '@nestjs/core';
import { BackgroundModule } from './background.module';

async function bootstrap() {
  const app = await NestFactory.create(BackgroundModule);
  await app.listen(3000);
}
bootstrap();
