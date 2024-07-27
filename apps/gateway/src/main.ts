import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './utils';
import * as session from 'express-session';
import * as cors from 'cors';
import {
  initTracing,
  SentryExceptionFilter,
  SentryModule,
  SentryService,
} from '@app/common';
import { WebsocketAdapter } from './utils/websocket/websocket-adapter';

async function bootstrap() {
  await initTracing('gateway');
  const app = await NestFactory.create(GatewayModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  if (configService.get<string>('NODE_ENV') === 'production') {
    app.select(SentryModule);
    const sentryService = app.get(SentryService);
    app.useGlobalFilters(new SentryExceptionFilter(sentryService));
  }
  app.setGlobalPrefix('api/v1');

  setupSwagger(app);

  app.use(
    cors({
      origin: true,
      methods: 'GET, POST, PUT, DELETE, PATCH',
      allowedHeaders: 'Content-Type, Authorization',
      credentials: true,
    }),
  );

  app.useWebSocketAdapter(
    new WebsocketAdapter(app, {
      // origin: configService.get('FRONTEND_URL'),
      origin: '*',
    }),
  );

  app.use(
    session({
      secret: configService.get<string>('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: { secure: true },
    }),
  );

  await app.listen(configService.get<number>('PORT'));
}
bootstrap();
