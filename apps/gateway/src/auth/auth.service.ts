import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from '../utils';
import { RmqService } from '@app/common';

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

  async logout(refreshToken) {
    try {
      return await this.rmqService.send(
        this.authClient,
        'authClient/logout',
        refreshToken,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }
}
