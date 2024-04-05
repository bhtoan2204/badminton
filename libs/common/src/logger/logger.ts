// import { LoggingWinston } from '@google-cloud/logging-winston';
import * as winston from 'winston';
import { ecsFormat } from '@elastic/ecs-winston-format';
// const loggingWinston = new LoggingWinston();

export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    ecsFormat({ convertReqRes: true })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' }),
    // loggingWinston
  ]
});
