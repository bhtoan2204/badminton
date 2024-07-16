import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  RmqOptions,
  Transport,
  RmqContext,
  ClientProxy,
} from '@nestjs/microservices';
import * as CircuitBreaker from 'opossum';
import { lastValueFrom, timeout } from 'rxjs';
@Injectable()
export class RmqService {
  private circuitBreaker: CircuitBreaker;

  constructor(private readonly configService: ConfigService) {
    const options = {
      timeout: 30000, // If our function takes longer than 30 seconds, trigger a failure
      errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
      resetTimeout: 30000, // After 30 seconds, try again.
    };

    this.circuitBreaker = new CircuitBreaker(
      this.callService.bind(this),
      options,
    );

    this.circuitBreaker.fallback((client: any, pattern: string) => {
      throw new HttpException(
        `Service ${client.options.queue} unavailable: ${pattern}`,
        503,
      );
    });
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
    const response = client.send(pattern, data).pipe(timeout(timeoutValue));
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
      throw new HttpException(error.message, error.status || 500);
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
