import { NestFactory } from '@nestjs/core';
import { FinanceModule } from './finance.module';

async function bootstrap() {
  const app = await NestFactory.create(FinanceModule);
  await app.listen(3000);
}
bootstrap();
