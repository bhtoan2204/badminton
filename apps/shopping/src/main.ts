import { NestFactory } from '@nestjs/core';
import { ShoppingModule } from './shopping.module';

async function bootstrap() {
  const app = await NestFactory.create(ShoppingModule);
  await app.listen(3000);
}
bootstrap();
