import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RabbitMqService {
  private readonly rabbitMqUrl: string = null;
  private readonly rabbitMqUsername: string = null;
  private readonly rabbitMqPassword: string = null;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.rabbitMqUrl = this.configService.get<string>(
      'RABBIT_MQ_MANAGEMENT_URI',
    );
    this.rabbitMqUsername = this.configService.get<string>(
      'RABBIT_MQ_MANAGEMENT_USERNAME',
    );
    this.rabbitMqPassword = this.configService.get<string>(
      'RABBIT_MQ_MANAGEMENT_PASSWORD',
    );
  }

  async getQueues() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.rabbitMqUrl}/api/queues`, {
          auth: {
            username: this.rabbitMqUsername,
            password: this.rabbitMqPassword,
          },
        }),
      );
      return response.data;
    } catch (error) {
      throw new RpcException({
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'Internal server error',
      });
    }
  }

  async getQueueDetail(queueName: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.rabbitMqUrl}/api/queues/%2F/${queueName}`,
          {
            auth: {
              username: this.rabbitMqUsername,
              password: this.rabbitMqPassword,
            },
          },
        ),
      );
      return response.data;
    } catch (error) {
      throw new RpcException({
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'Internal server error',
      });
    }
  }

  async getNode() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.rabbitMqUrl}/api/nodes`, {
          auth: {
            username: this.rabbitMqUsername,
            password: this.rabbitMqPassword,
          },
        }),
      );
      return response.data;
    } catch (error) {
      throw new RpcException({
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'Internal server error',
      });
    }
  }

  async getNodeStatistics(nodeName: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.rabbitMqUrl}/api/nodes/${nodeName}`, {
          auth: {
            username: this.rabbitMqUsername,
            password: this.rabbitMqPassword,
          },
        }),
      );
      return response.data;
    } catch (error) {
      throw new RpcException({
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'Internal server error',
      });
    }
  }

  async healthCheck() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.rabbitMqUrl}/api/healthchecks/node`, {
          auth: {
            username: this.rabbitMqUsername,
            password: this.rabbitMqPassword,
          },
        }),
      );
      return response.data;
    } catch (error) {
      throw new RpcException({
        statusCode: error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'Internal server error',
      });
    }
  }
}
