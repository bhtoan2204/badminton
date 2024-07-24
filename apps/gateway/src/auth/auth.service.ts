import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from '../utils';
import { RmqService } from '@app/common';
import * as Sentry from '@sentry/nestjs';

@Injectable()
export class AuthApiService {
  constructor(
    @Inject(AUTH_SERVICE) private authClient: ClientProxy,
    private readonly rmqService: RmqService,
  ) {}

  async localLogin(currentUser) {
    try {
      return await this.rmqService.send(
        this.authClient,
        'authClient/local/login',
        currentUser,
      );
    } catch (error) {
      Sentry.captureException(error);
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async refreshToken(currentUser, refreshToken) {
    try {
      return await this.rmqService.send(
        this.authClient,
        'authClient/refresh_token',
        { currentUser, refreshToken },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async logout(id_user: string) {
    try {
      return await this.rmqService.send(
        this.authClient,
        'authClient/logout',
        id_user,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }
}
