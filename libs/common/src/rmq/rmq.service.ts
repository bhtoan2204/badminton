import { Injectable, HttpException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  RmqOptions,
  Transport,
  RmqContext,
  ClientProxy,
} from '@nestjs/microservices';
import * as CircuitBreaker from 'opossum';
import { lastValueFrom, timeout } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

@Injectable()
export class RmqService {
  private circuitBreaker: CircuitBreaker;
  private lastErrorWasTimeout = false;
  private readonly logger = new Logger(RmqService.name);

  constructor(private readonly configService: ConfigService) {
    const options = {
      timeout: 10000,
      errorThresholdPercentage: 50,
      resetTimeout: 0,
    };

    this.circuitBreaker = new CircuitBreaker(
      this.callService.bind(this),
      options,
    );

    this.circuitBreaker.on('open', () => {
      this.logger.warn('Circuit breaker opened');
    });

    this.circuitBreaker.on('halfOpen', () => {
      this.logger.log('Circuit breaker half-open');
    });

    this.circuitBreaker.on('close', () => {
      this.logger.log('Circuit breaker closed');
      if (this.lastErrorWasTimeout) {
        this.logger.log('Circuit breaker closed due to timeout');
      }
    });

    this.circuitBreaker.fallback(
      (
        client: any,
        pattern: string,
        data: any,
        timeoutValue: number,
        error: Error,
      ) => {
        this.logger.error(
          `Fallback triggered for service ${client.options.queue} and pattern ${pattern}: ${error.message}`,
        );
        throw new HttpException(
          error.message,
          error['status'] || error['statusCode'] || 408,
        );
      },
    );
  }

  getOptions(queue: string, noAck = false): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.get<string>('RABBIT_MQ_URI')],
        queue: this.configService.get<string>(`RABBIT_MQ_${queue}_QUEUE`),
        noAck,
        persistent: true,
      },
    };
  }

  async callService(
    client: ClientProxy,
    pattern: string,
    data: any,
    timeoutValue: number = 10000,
  ) {
    const response = client.send(pattern, data).pipe(
      timeout(timeoutValue),
      retry(2),
      catchError((err) => {
        if (err.name === 'TimeoutError') {
          this.lastErrorWasTimeout = true;
          throw new TimeoutError(`Timeout occurred after ${timeoutValue}ms`);
        } else {
          this.lastErrorWasTimeout = false;
        }
        this.logger.error(`Error in callService: ${err.message}`, err.stack);
        throw err;
      }),
    );
    return await lastValueFrom(response);
  }

  async send(
    client: ClientProxy,
    pattern: string,
    data: any,
    timeoutValue?: number,
  ) {
    try {
      return await this.circuitBreaker.fire(
        client,
        pattern,
        data,
        timeoutValue,
      );
    } catch (error) {
      if (error instanceof TimeoutError) {
        this.logger.error(`Service timeout error: ${error.message}`);
        throw new HttpException(error.message, 504); // 504 Gateway Timeout
      } else {
        this.logger.error(`Service error: ${error.message}`, error.stack);
        throw new HttpException(error.message, error.status || 500);
      }
    }
  }

  ack(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }

  nack(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.nack(originalMessage);
  }

  reject(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.reject(originalMessage, false);
  }
}
