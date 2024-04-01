// import { LoggingWinston } from '@google-cloud/logging-winston';
import * as winston from 'winston';

// const loggingWinston = new LoggingWinston();

export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' }),
    // loggingWinston
  ]
});
