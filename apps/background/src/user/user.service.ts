import {
  GetUserRequest,
  GetUserResponse,
  GetUsersRequest,
  GetUsersResponse,
  USER_SERVICE_NAME,
  UserServiceClient,
} from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UserService implements OnModuleInit {
  private userService: UserServiceClient;
  constructor(@Inject('USER') private userClient: ClientGrpc) {}

  onModuleInit() {
    this.userService =
      this.userClient.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  async findOne(req: GetUserRequest): Promise<GetUserResponse> {
    try {
      return await lastValueFrom(this.userService.findById(req));
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async findByIds(req: GetUsersRequest): Promise<GetUsersResponse> {
    try {
      return await lastValueFrom(this.userService.findByIds(req));
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
