import { NestFactory } from '@nestjs/core';
import { ElasticsearchModule } from './elasticsearch.module';

async function bootstrap() {
  const app = await NestFactory.create(ElasticsearchModule);
  await app.listen(3000);
}
bootstrap();
