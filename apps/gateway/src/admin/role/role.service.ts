import { HttpException, Inject, Injectable } from '@nestjs/common';
import { FAMILY_SERVICE } from '../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { CreateRoleDto } from './dto/createRole.dto';
import { UpdateRoleDto } from './dto/updateRole.dto';

@Injectable()
export class RoleService {
  constructor(@Inject(FAMILY_SERVICE) private authClient: ClientProxy) {}

  async getAllRole(
    page: number,
    itemsPerPage: number,
    search: string,
    sortBy: string,
    sortDesc: boolean,
  ) {
    try {
      const source = this.authClient
        .send('familyClient/getAllRole', {
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

  async createRole(dto: CreateRoleDto) {
    try {
      const source = this.authClient
        .send('familyClient/createRole', dto)
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

  async updateRole(dto: UpdateRoleDto) {
    try {
      const source = this.authClient
        .send('familyClient/updateRole', dto)
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
}
