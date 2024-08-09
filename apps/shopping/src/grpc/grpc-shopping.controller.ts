import { Controller } from '@nestjs/common';
import { GrpcShoppingService } from './grpc-shopping.service';

@Controller()
export class GrpcShoppingController {
  constructor(private readonly grpcShoppingService: GrpcShoppingService) {}
}
