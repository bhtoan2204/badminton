import {
  FindHouseholdByIdsRequest,
  FindOneHouseholdByIdRequest,
  HOUSEHOLD_SERVICE_NAME,
  HouseholdResponse,
  HouseholdServiceClient,
  HouseholdsResponse,
  UpdateOneByIdRequest,
} from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class HouseholdService implements OnModuleInit {
  private householdService: HouseholdServiceClient;

  constructor(@Inject('HOUSEHOLD') private householdClient: ClientGrpc) {}

  onModuleInit() {
    this.householdService =
      this.householdClient.getService<HouseholdServiceClient>(
        HOUSEHOLD_SERVICE_NAME,
      );
  }

  async findOneById(
    request: FindOneHouseholdByIdRequest,
  ): Promise<HouseholdResponse> {
    return await lastValueFrom(this.householdService.findOneById(request));
  }

  async updateOneById(
    request: UpdateOneByIdRequest,
  ): Promise<HouseholdResponse> {
    return await lastValueFrom(this.householdService.updateOneById(request));
  }

  async findByIds(
    request: FindHouseholdByIdsRequest,
  ): Promise<HouseholdsResponse> {
    return await lastValueFrom(this.householdService.findByIds(request));
  }
}
