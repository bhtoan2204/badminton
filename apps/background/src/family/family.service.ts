import {
  Empty,
  FAMILY_SERVICE_NAME,
  FamilyServiceClient,
  GerUserIdsRequest,
  GerUserIdsResponse,
  GetFamiliesRequest,
  GetFamiliesResponse,
  GetFamilyRequest,
  GetFamilyResponse,
} from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class FamilyService implements OnModuleInit {
  private familyService: FamilyServiceClient;

  constructor(@Inject('FAMILY') private familyClient: ClientGrpc) {}

  onModuleInit() {
    this.familyService =
      this.familyClient.getService<FamilyServiceClient>(FAMILY_SERVICE_NAME);
  }

  async findById(req: GetFamilyRequest): Promise<GetFamilyResponse> {
    try {
      return await lastValueFrom(this.familyService.findById(req));
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async findByIds(req: GetFamiliesRequest): Promise<GetFamiliesResponse> {
    try {
      return await lastValueFrom(this.familyService.findByIds(req));
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async getIdsUserInFamily(
    req: GerUserIdsRequest,
  ): Promise<GerUserIdsResponse> {
    try {
      return await lastValueFrom(this.familyService.findIdsUserInFamily(req));
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async getExpiredFamilies(req: Empty): Promise<GetFamiliesResponse> {
    try {
      return await lastValueFrom(this.familyService.findExpiredFamilies(req));
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
