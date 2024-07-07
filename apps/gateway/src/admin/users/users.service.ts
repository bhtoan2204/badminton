import { HttpException, Inject, Injectable } from '@nestjs/common';
import { AUTH_SERVICE } from '../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class UsersService {
  constructor(
    @Inject(AUTH_SERVICE) private authClient: ClientProxy,
    @InjectQueue('auth') private readonly authQueue: Queue,
  ) {}

  async getUsers(
    page: number,
    itemsPerPage: number,
    search: string,
    sortBy: string,
    sortDesc: boolean,
  ) {
    try {
      const source = this.authClient
        .send('authClient/getUsersAdmin', {
          page,
          itemsPerPage,
          search,
          sortBy,
          sortDesc,
        })
        .pipe(timeout(15000));
      const data = await lastValueFrom(source);
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }

  async banUser(id_user: string) {
    try {
      const source = this.authClient
        .send('authClient/banUser', { id_user })
        .pipe(timeout(15000));
      const data = await lastValueFrom(source);
      await this.authQueue.add('logoutUser', { id_user: id_user });
      return data;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        throw new HttpException('Timeout', 408);
      }
      throw new HttpException(error, error.statusCode);
    }
  }
}
