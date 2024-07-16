import { HttpException, Inject, Injectable } from '@nestjs/common';
import { AUTH_SERVICE } from '../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { RmqService } from '@app/common';

@Injectable()
export class UsersService {
  constructor(
    @Inject(AUTH_SERVICE) private authClient: ClientProxy,
    @InjectQueue('auth') private readonly authQueue: Queue,
    private readonly rmqService: RmqService,
  ) {}

  async getUsers(
    page: number,
    itemsPerPage: number,
    search: string,
    sortBy: string,
    sortDesc: boolean,
  ) {
    try {
      return await this.rmqService.send(
        this.authClient,
        'authClient/getUsersAdmin',
        { page, itemsPerPage, search, sortBy, sortDesc },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async banUser(id_user: string) {
    try {
      const data = await this.rmqService.send(
        this.authClient,
        'authClient/banUser',
        { id_user },
      );
      await this.authQueue.add('logoutUser', { id_user: id_user });
      return data;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async unbanUser(id_user: string) {
    try {
      const data = await this.rmqService.send(
        this.authClient,
        'authClient/unbanUser',
        { id_user },
      );
      return data;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async getTopUsers(limit: number) {
    try {
      return await this.rmqService.send(
        this.authClient,
        'authClient/getTopUsersLogin',
        { limit },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }
}
