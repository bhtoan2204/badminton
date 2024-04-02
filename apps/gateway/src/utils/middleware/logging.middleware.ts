import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { logger } from '@app/common';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    const { method, originalUrl: url } = request;
    const start = process.hrtime();

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length') || 0;
      const [sec, nanosec] = process.hrtime(start);
      const responseTime = (sec * 1000 + nanosec / 1e6).toFixed(0);

      if (statusCode >= 400) {
        logger.error(
          `Error in ${method} ${url}: ${statusCode} ${contentLength} - ${responseTime} ms - ${ip}`
        );
      } else {
        logger.info(
          `Successful in ${method} ${url} ${statusCode} ${contentLength} - ${responseTime} ms - ${ip}`
        );
      }
    });

    next();
  }
}
