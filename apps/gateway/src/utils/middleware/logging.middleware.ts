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
      const contentLength = response.get('content-length') || '0';
      const [sec, nanosec] = process.hrtime(start);
      const responseTime = (sec * 1000 + nanosec / 1e6).toFixed(0);
      const errorMessage = response.statusMessage || 'No error message provided';
      const logEntry = {
        ip: ip,
        method: method,
        url: url,
        statusCode: statusCode,
        contentLength: contentLength,
        responseTimeMs: responseTime,
        message: `${statusCode >= 400 ? errorMessage : 'Successful'}`
      };
      
      if (statusCode >= 400) {
        logger.error(logEntry);
      } else {
        logger.info(logEntry);
      }
    });

    next();
  }
}
