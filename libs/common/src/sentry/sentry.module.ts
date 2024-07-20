import { Module, Global } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { SentryService } from './sentry.service';

@Global()
@Module({
  providers: [
    {
      provide: SentryService,
      useFactory: () => {
        Sentry.init({
          dsn: process.env.SENTRY_DSN,
          tracesSampleRate: 1.0,
        });
        return new SentryService();
      },
    },
  ],
  exports: [SentryService],
})
export class SentryModule {}
