import { Module } from '@nestjs/common';
import { GrpcShoppingController } from './grpc-shopping.controller';
import { GrpcShoppingService } from './grpc-shopping.service';

@Module({
  controllers: [GrpcShoppingController],
  providers: [GrpcShoppingService],
})
export class GrpcControllerModule {}
