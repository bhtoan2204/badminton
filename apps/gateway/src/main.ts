import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { configSwagger, customCssUrl, customJs, customfavIcon } from '../config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('/api/v1', app, document, {
    customfavIcon, customJs, customCssUrl
  });
  await app.listen(configService.get<number>('PORT'));
}
bootstrap();
