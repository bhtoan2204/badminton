import { Module, Global } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { SentryService } from './sentry.service';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
@Global()
@Module({
  providers: [
    {
      provide: SentryService,
      useFactory: () => {
        Sentry.init({
          dsn: process.env.SENTRY_DSN,
          tracesSampleRate: 1.0,
          integrations: [nodeProfilingIntegration()],
        });
        return new SentryService();
      },
    },
  ],
  exports: [SentryService],
})
export class SentryModule {}
