import { NestFactory } from '@nestjs/core';
import { GuidelineModule } from './guideline.module';

async function bootstrap() {
  const app = await NestFactory.create(GuidelineModule);
  await app.listen(3000);
}
bootstrap();
