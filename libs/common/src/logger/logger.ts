import * as winston from 'winston';
import { ecsFormat } from '@elastic/ecs-winston-format';

export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    ecsFormat({ convertReqRes: true }),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' }),
  ],
});
