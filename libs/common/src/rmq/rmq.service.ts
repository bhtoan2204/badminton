import { Injectable, HttpException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  RmqOptions,
  Transport,
  RmqContext,
  ClientProxy,
} from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
export class RmqService {
  private readonly logger = new Logger(RmqService.name);

  constructor(private readonly configService: ConfigService) {}

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
      return await this.callService(client, pattern, data, timeoutValue);
    } catch (error) {
      this.logger.error(`Service error: ${error.message}`, error.stack);
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
