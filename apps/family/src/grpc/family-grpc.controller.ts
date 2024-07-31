import {
  FamilyServiceController,
  FamilyServiceControllerMethods,
  GerUserIdsRequest,
  GerUserIdsResponse,
  GetFamiliesRequest,
  GetFamiliesResponse,
  GetFamilyRequest,
  GetFamilyResponse,
} from '@app/common';
import { Controller } from '@nestjs/common';
import { FamilyGrpcService } from './family-grpc.service';
import { Observable } from 'rxjs';

@Controller()
@FamilyServiceControllerMethods()
export class FamilyGrpcController implements FamilyServiceController {
  constructor(private readonly familyGrpcService: FamilyGrpcService) {}

  findIdsUserInFamily(
    req: GerUserIdsRequest,
  ):
    | Promise<GerUserIdsResponse>
    | Observable<GerUserIdsResponse>
    | GerUserIdsResponse {
    return this.familyGrpcService.getIdsUserInFamily(req);
  }

  findById(
    request: GetFamilyRequest,
  ):
    | Promise<GetFamilyResponse>
    | Observable<GetFamilyResponse>
    | GetFamilyResponse {
    return this.familyGrpcService.getFamilyById(request);
  }
  findByIds(
    request: GetFamiliesRequest,
  ):
    | Promise<GetFamiliesResponse>
    | Observable<GetFamiliesResponse>
    | GetFamiliesResponse {
    return this.familyGrpcService.getFamilyByIds(request);
  }
}
