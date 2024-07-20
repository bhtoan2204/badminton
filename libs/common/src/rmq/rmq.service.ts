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

@Injectable()
export class RmqService {
  private circuitBreaker: CircuitBreaker;
  private readonly logger = new Logger(RmqService.name);

  constructor(private readonly configService: ConfigService) {
    const options = {
      timeout: 30000,
      errorThresholdPercentage: 50,
      resetTimeout: 10000,
    };

    this.circuitBreaker = new CircuitBreaker(
      this.callService.bind(this),
      options,
    );

    this.circuitBreaker.on('open', () =>
      this.logger.warn('Circuit breaker opened'),
    );
    this.circuitBreaker.on('halfOpen', () =>
      this.logger.log('Circuit breaker half-open'),
    );
    this.circuitBreaker.on('close', () =>
      this.logger.log('Circuit breaker closed'),
    );

    this.circuitBreaker.fallback(
      (
        client: any,
        pattern: string,
        data: any,
        timeoutValue: number,
        error: any,
      ) => {
        this.logger.error(
          `Fallback triggered for service ${client.options.queue} and pattern ${pattern}`,
        );
        console.log(error);
        throw new HttpException(error.message, error.status || 500);

        // throw new HttpException(
        //   `Service ${client.options.queue} unavailable: ${pattern}`,
        //   503,
        // );
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
    timeoutValue: number = 15000,
  ) {
    try {
      const response = client.send(pattern, data).pipe(
        timeout(timeoutValue),
        retry(2), // Retry twice before failing
        // catchError((err) => {
        //   this.logger.error(`Error in callService: ${err.message}`, err.stack);
        //   throw err;
        // }),
      );
      return await lastValueFrom(response);
    } catch (error) {
      this.logger.error(`Error in callService: ${error.message}`, error.stack);
      throw new HttpException(error.message, error.status || 500);
    }
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
      this.logger.error(`Error in send method: ${error.message}`, error.stack);
      throw error;
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
