import { HttpException, Inject, Injectable } from '@nestjs/common';
import { FAMILY_SERVICE } from '../../utils';
import { ClientProxy } from '@nestjs/microservices';
import { CreateRoleDto } from './dto/createRole.dto';
import { UpdateRoleDto } from './dto/updateRole.dto';
import { RmqService } from '@app/common';

@Injectable()
export class RoleService {
  constructor(
    @Inject(FAMILY_SERVICE) private authClient: ClientProxy,
    private readonly rmqService: RmqService,
  ) {}

  async getAllRole(
    page: number,
    itemsPerPage: number,
    search: string,
    sortBy: string,
    sortDesc: boolean,
  ) {
    try {
      return await this.rmqService.send(
        this.authClient,
        'familyClient/getAllRole',
        { page, itemsPerPage, search, sortBy, sortDesc },
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async createRole(dto: CreateRoleDto) {
    try {
      return await this.rmqService.send(
        this.authClient,
        'familyClient/createRole',
        dto,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }

  async updateRole(dto: UpdateRoleDto) {
    try {
      return await this.rmqService.send(
        this.authClient,
        'familyClient/updateRole',
        dto,
      );
    } catch (error) {
      throw new HttpException(
        error.message,
        error.statusCode || error.status || 500,
      );
    }
  }
}
