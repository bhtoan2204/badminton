import {
  FindHouseholdByIdsRequest,
  FindOneHouseholdByIdRequest,
  HouseholdResponse,
  HouseholdServiceController,
  HouseholdServiceControllerMethods,
  HouseholdsResponse,
  UpdateOneByIdRequest,
} from '@app/common';
import { Controller } from '@nestjs/common';
import { GrpcHouseholdService } from './grpc-household.service';
import { Observable } from 'rxjs';

@Controller()
@HouseholdServiceControllerMethods()
export class GrpcHouseholdController implements HouseholdServiceController {
  constructor(private readonly grpcHouseholdService: GrpcHouseholdService) {}

  findOneById(
    request: FindOneHouseholdByIdRequest,
  ):
    | Promise<HouseholdResponse>
    | Observable<HouseholdResponse>
    | HouseholdResponse {
    return this.grpcHouseholdService.findOneById(request);
  }
  updateOneById(
    request: UpdateOneByIdRequest,
  ):
    | Promise<HouseholdResponse>
    | Observable<HouseholdResponse>
    | HouseholdResponse {
    return this.grpcHouseholdService.updateOneById(request);
  }

  findByIds(
    request: FindHouseholdByIdsRequest,
  ):
    | Promise<HouseholdsResponse>
    | Observable<HouseholdsResponse>
    | HouseholdsResponse {
    return this.grpcHouseholdService.findByIds(request);
  }
}
