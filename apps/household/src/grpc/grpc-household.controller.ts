import {
  FindOneHouseholdByIdRequest,
  HouseholdResponse,
  HouseholdServiceController,
  HouseholdServiceControllerMethods,
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
    throw new Error('Method not implemented.');
  }
}
