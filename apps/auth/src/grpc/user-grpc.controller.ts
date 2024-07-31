import {
  GetUserRequest,
  GetUserResponse,
  GetUsersRequest,
  GetUsersResponse,
  UserServiceController,
  UserServiceControllerMethods,
} from '@app/common';
import { Controller } from '@nestjs/common';
import { UserGrpcService } from './user-grpc.service';

@Controller()
@UserServiceControllerMethods()
export class UserGrpcController implements UserServiceController {
  constructor(private readonly userGrpcService: UserGrpcService) {}

  async findById(request: GetUserRequest): Promise<GetUserResponse> {
    return await this.userGrpcService.findById(request.idUser);
  }

  async findByIds(request: GetUsersRequest): Promise<GetUsersResponse> {
    return await this.userGrpcService.findByIds(request.idUsers);
  }
}
