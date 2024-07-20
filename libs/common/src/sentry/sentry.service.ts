import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/node';

@Injectable()
export class SentryService {
  captureException(exception: any) {
    Sentry.captureException(exception);
  }
}
